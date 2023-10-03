import { pipeline, env } from "@xenova/transformers";
import init, { Model } from "./phi/m.js";
import URI from "urijs"

// Shamelessly stolen from Transformers.js

export async function tryCache(cache, ...names) {
    for (let name of names) {
        try {
			console.log(name)
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
	const contentLength = +response.headers.get('Content-Length');
	let receivedLength = 0;
	let chunks = []; 
	let uri = new URI(url)

	while(true) {
		const {done, value} = await reader.read();
		if (done) {
			break;
		}
		chunks.push(value);
		receivedLength += value.length;
		let percent = (receivedLength / contentLength) * 100
		self.postMessage({ status: "progress", file: uri.filename(), progress: percent });
	}

	let chunksAll = new Uint8Array(receivedLength); 
	let position = 0;
	for(let chunk of chunks) {
		chunksAll.set(chunk, position); 
		position += chunk.length;
	}
	return chunksAll
}

async function fetchArrayBuffer(url) {
	let cache = await caches.open('transformers-cache');

	const response = await tryCache(cache, url);
	if (response != undefined) {
		console.log(url)
		let res = await read_stream(url, response)
		cache.put(url, new Response(res, {
            headers: response.headers
        }));
		return new Uint8Array(res);
	}
	else {
		const response = await fetch(url);
		let res = await read_stream(url, response)
		cache.put(url, new Response(res, {
            headers: response.headers,
        }));
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
  
		this.instance[modelID] = new Model(
		  weightsArrayU8,
		  tokenizerArrayU8,
		  quantized
		);
		self.postMessage({ status: "ready" });
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
	if (event.data.command != "abort") {
		if (event.data.is_phi) {
			controller = new AbortController();
			generate_phi(event.data);
		}
		else {
			let pipe = await FlanPipeline.getInstance(
				(x) => {
					self.postMessage(x);
				},
				event.data.model,
				event.data.task
			);
		
			let output = await pipe(event.data.text, {
				max_new_tokens: event.data.max_new_tokens,
				temperature: event.data.temperature,
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
			});
		}
	}
	else {
		if (controller != null)
			controller.abort();
	}
});



async function generate_phi(data) {
	const tokenizerURL = "https://huggingface.co/microsoft/phi-1_5/raw/main/tokenizer.json";
	const weightsURL = "https://huggingface.co/lmz/candle-quantized-phi/resolve/main/model-q4k.gguf";
	let prompt = data.text
	let maxSeqLen = data.max_new_tokens
	let temp = data.temperature
	let modelID = 0;
	let quantized = true;
	let top_p = 1;
	let repeatPenalty = 1.1;
	let seed = 299792458;

	self.postMessage({ status: "initiate", file: "tokenizer.json" }); // Fake init

	try {
	  const model = await Phi.getInstance(
		weightsURL,
		modelID,
		tokenizerURL,
		quantized
	  );
  
	  const firstToken = model.init_with_prompt(
		prompt,
		temp,
		top_p,
		repeatPenalty,
		64,
		BigInt(seed)
	  );
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
		  const tokensSec =
			((tokensCount + 1) / (performance.now() - startTime)) * 1000;
  
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
      console.log(e)
	  self.postMessage({ error: e });
	}
  }