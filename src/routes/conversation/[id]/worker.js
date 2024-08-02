import { pipeline, env } from "@xenova/transformers";
import init, { Model } from "./phi/m.js";
import { streamToAsyncIterable } from "$lib/utils/streamToAsyncIterable";
import URI from "urijs";
import { compileTemplate2 } from "$lib/utils/template";

// Shamelessly stolen from Transformers.js

export async function tryCache(cache, ...names) {
	for (let name of names) {
		try {
			console.log(name);
			let result = await cache.match(name);
			if (result) return result;
		} catch (e) {
			continue;
		}
	}
	return undefined;
}

async function read_stream(url, response) {
	const reader = response.body.getReader();
	const contentLength = +response.headers.get("Content-Length");
	let receivedLength = 0;
	let chunks = [];
	let uri = new URI(url);

	while (true) {
		const { done, value } = await reader.read();
		if (done) {
			break;
		}
		chunks.push(value);
		receivedLength += value.length;
		let percent = (receivedLength / contentLength) * 100;
		self.postMessage({ status: "progress", file: uri.filename(), progress: percent });
	}

	let chunksAll = new Uint8Array(receivedLength);
	let position = 0;
	for (let chunk of chunks) {
		chunksAll.set(chunk, position);
		position += chunk.length;
	}
	return chunksAll;
}

async function fetchArrayBuffer(url) {
	let cache = await caches.open("transformers-cache");

	const response = await tryCache(cache, url);
	if (response != undefined) {
		console.log(url);
		let res = await read_stream(url, response);
		cache.put(
			url,
			new Response(res, {
				headers: response.headers,
			})
		);
		return new Uint8Array(res);
	} else {
		const response = await fetch(url);
		let res = await read_stream(url, response);
		cache.put(
			url,
			new Response(res, {
				headers: response.headers,
			})
		);
		return new Uint8Array(res);
	}
}

class Phi {
	static instance = {};

	static async getInstance(weightsURL, modelID, tokenizerURL, quantized) {
		// load individual modelID only once
		if (!this.instance[modelID]) {
			await init();

			self.postMessage({ status: "loading", message: "Loading Model" });

			const [weightsArrayU8, tokenizerArrayU8] = await Promise.all([
				fetchArrayBuffer(weightsURL),
				fetchArrayBuffer(tokenizerURL),
			]);

			self.postMessage({ status: "init_model" });

			this.instance[modelID] = new Model(weightsArrayU8, tokenizerArrayU8, quantized);
			self.postMessage({ status: "ready", model: "phi-1_5" });
		}
		return this.instance[modelID];
	}
}

export class FlanPipeline {
	static curr_model = "";
	static instance = null;

	static async getInstance(progress_callback = null, model, task) {
		if (this.instance === null) {
			this.instance = pipeline(task, model, { progress_callback });
			this.curr_model = model;
		} else {
			if (this.curr_model != model) {
				this.instance = pipeline(task, model, { progress_callback });
				this.curr_model = model;
			}
		}
		return this.instance;
	}
}

let controller = null;
let phi_model = null;

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
	if (event.data.command == "abort") {
		console.log("ABORT");
		if (controller != null) {
			try {
				controller.abort();
			} catch (e) {
				console.log(e);
			}
		}
	} else if (event.data.model_obj.is_local ?? true) {
		if (event.data.model_obj.is_phi ?? false) {
			controller = new AbortController();
			generate_phi(event.data);
		} else {
			let pipe = await FlanPipeline.getInstance(
				(x) => {
					self.postMessage(x);
				},
				event.data.model,
				event.data.model_obj.type
			);

			let output = await pipe(event.data.text, {
				max_new_tokens: event.data.model_obj.parameters?.max_new_tokens ?? 256,
				temperature: event.data.model_obj.parameters?.temperature ?? 0.7,
				callback_function: (x) => {
					self.postMessage({
						status: "update",
						output: pipe.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true }),
						id_now: event.data.id_now,
					});
				},
			});

			// Send the output back to the main thread
			self.postMessage({
				status: "complete",
				output: output,
				searchID: event.data.searchID,
				id_now: event.data.id_now,
				model: "phi-1_5",
			});
		}
	} else {
		const m = {
			preprompt: event.data.model_obj.preprompt,
			userMessageToken: event.data.model_obj.userMessageToken,
			userMessageEndToken: event.data.model_obj.userMessageEndToken,
			assistantMessageToken: event.data.model_obj.assistantMessageToken,
			assistantMessageEndToken: event.data.model_obj.assistantMessageEndToken,
		};

		const t = compileTemplate2(event.data.model_obj.chatPromptTemplate, m);
		const res = t({ messages: event.data.messages, preprompt: m.preprompt });

		controller = new AbortController();
		const context = buildContext(event.data);
		const newParameters = {
			max_new_tokens: event.data.model_obj.parameters?.max_new_tokens ?? 256,
			temperature: event.data.model_obj.parameters?.temperature ?? 0.7,
			truncate: event.data.model_obj.parameters?.truncate ?? 2048,
			return_full_text: false,
		};
		let body = JSON.stringify({
			inputs: res,
			parameters: newParameters,
		});
		let text_output = "";
		const server_addr = event.data.model_obj.server_addr ?? "";

		try {
			let resp = await fetch(server_addr + "/generate_stream", {
				headers: {
					"Content-Type": "application/json",
					accesstoken: event.data.jwt,
				},
				method: "POST",
				body: body,
				signal: controller.signal,
			});

			if (resp.ok) {
				let stream1 = resp.body;
				for await (const input of streamToAsyncIterable(stream1)) {
					const lines = new TextDecoder()
						.decode(input)
						.split("\n")
						.filter((line) => line.startsWith("data:"));

					for (const message of lines) {
						let lastIndex = message.lastIndexOf("\ndata:");
						if (lastIndex === -1) {
							lastIndex = message.indexOf("data");
						}

						if (lastIndex === -1) {
							console.error("Could not parse last message", message);
						}

						let lastMessage = message.slice(lastIndex).trim().slice("data:".length);
						if (lastMessage.includes("\n")) {
							lastMessage = lastMessage.slice(0, lastMessage.indexOf("\n"));
						}

						try {
							const lastMessageJSON = JSON.parse(lastMessage);
							if (!lastMessageJSON.generated_text) {
								const res = lastMessageJSON.token.text;
								text_output += res;
								self.postMessage({
									status: "update",
									output: text_output,
									id_now: event.data.id_now,
								});
							}
						} catch (e) {
							console.log(lastMessage);
							console.log(e);
						}
					}
				}
			} else {
				if (resp.status == 401 || resp.status == 403) {
					self.postMessage({
						status: "invalid_jwt",
					});
				}
				console.log(resp);
				self.postMessage({
					status: "aborted",
					output: text_output,
					searchID: event.data.searchID,
					id_now: event.data.id_now,
				});
				self.postMessage({
					status: "error",
					output: text_output,
					error: "Error while trying to communicate with the server",
				});
				return;
			}
		} catch (e) {
			self.postMessage({
				status: "aborted",
				output: text_output,
				searchID: event.data.searchID,
				id_now: event.data.id_now,
			});
			if (e.name != "AbortError") {
				self.postMessage({
					status: "error",
					output: text_output,
					error: "Error while trying to communicate with the server",
				});
			}
			return;
		}
		self.postMessage({
			status: "complete",
			output: text_output,
			searchID: event.data.searchID,
			id_now: event.data.id_now,
		});
	}
});

async function generate_phi(data) {
	const tokenizerURL = "https://huggingface.co/microsoft/phi-1_5/raw/main/tokenizer.json";
	const weightsURL = "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/model-q4k.gguf";
	let prompt = data.text;
	let maxSeqLen = data.model_obj.parameters?.max_new_tokens ?? 256;
	let temp = data.model_obj.parameters?.temperature ?? 0.7;
	let modelID = 0;
	let quantized = true;
	let top_p = 1;
	let repeatPenalty = 1.1;
	let seed = 299792458;

	self.postMessage({ status: "initiate", file: "tokenizer.json", name: "phi-1_5" }); // Fake init

	try {
		const model = await Phi.getInstance(weightsURL, modelID, tokenizerURL, quantized);

		const firstToken = model.init_with_prompt(prompt, temp, top_p, repeatPenalty, 64, BigInt(seed));
		const seq_len = 2048;

		let sentence = firstToken;
		let maxTokens = maxSeqLen ? maxSeqLen : seq_len - prompt.length - 1;
		let startTime = performance.now();
		let tokensCount = 0;

		while (tokensCount < maxTokens) {
			await new Promise(async (resolve) => {
				if (controller && controller.signal.aborted) {
					self.postMessage({
						status: "aborted",
						message: "Aborted",
						output: sentence,
						searchID: data.searchID,
						id_now: data.id_now,
					});
					return;
				}
				const token = await model.next_token();
				if (token === "<|endoftext|>") {
					self.postMessage({
						status: "complete",
						output: sentence,
						searchID: data.searchID,
						id_now: data.id_now,
					});
					return;
				}
				const tokensSec = ((tokensCount + 1) / (performance.now() - startTime)) * 1000;

				sentence += token;
				self.postMessage({
					status: "update",
					message: "Generating token",
					token: token,
					output: sentence,
					totalTime: performance.now() - startTime,
					tokensSec,
					prompt: prompt,
					id_now: data.id_now,
				});
				setTimeout(resolve, 0);
			});
			tokensCount++;
		}
		self.postMessage({
			status: "complete",
			output: sentence,
			searchID: data.searchID,
			id_now: data.id_now,
		});
	} catch (e) {
		console.log(e);
		self.postMessage({ error: e });
	}
}
function buildContext(data) {
	// Will be replaced by the original contextManager made by HF
	let context = "";
	let got_user_prompt = false;
	for (let message of data.messages) {
		if (message.content.trim().length > 0) {
			if (message.from === "user") {
				if (got_user_prompt == false) {
					context = context + "<s>[INST] " + message.content;
					got_user_prompt = true;
				} else {
					context = context + " " + message.content;
				}
			} else {
				got_user_prompt = false;
				context = context + " [/INST]" + message.content + " </s>";
			}
		}
	}
	if (got_user_prompt == true) {
		context = context + " [/INST]";
	} else {
		context = context + "<s>[INST] " + data.text + " [/INST]";
	}
	return context;
}
