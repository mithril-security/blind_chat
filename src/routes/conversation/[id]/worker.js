import { pipeline, env } from "@xenova/transformers";

export class FlanPipeline {
	static task = "text2text-generation";
	static instance = null;

	static async getInstance(progress_callback = null, model, task) {
		if (this.instance === null) {
			this.instance = pipeline(task, model, { progress_callback });
		}
		return this.instance;
	}
}

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
	let pipe = await FlanPipeline.getInstance((x) => {
		self.postMessage(x);
	}, event.data.model, event.data.task);

	let output = await pipe(event.data.text, {
		max_new_tokens: event.data.max_new_tokens,
		temperature: event.data.temperature,
		callback_function: (x) => {
			self.postMessage({
				status: "update",
				output: pipe.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true }),
				id_now: event.data.id_now
			});
		},
	});

	// Send the output back to the main thread
	self.postMessage({
		status: "complete",
		output: output,
		searchID: event.data.searchID,
		id_now: event.data.id_now
	});
});
