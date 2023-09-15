import { pipeline, env } from "@xenova/transformers";

export class FlanPipeline {
	static task = "text2text-generation";
	static model = "Xenova/LaMini-Flan-T5-783M";
	static instance = null;

	static async getInstance(progress_callback = null) {
		if (this.instance === null) {
			this.instance = pipeline(this.task, this.model, { progress_callback });
		}
		return this.instance;
	}
}

// Listen for messages from the main thread
self.addEventListener("message", async (event) => {
	let pipe = await FlanPipeline.getInstance((x) => {
		self.postMessage(x);
	});

	let output = await pipe(event.data.text, {
		max_new_tokens: 256,
		callback_function: (x) => {
			self.postMessage({
				status: "update",
				output: pipe.tokenizer.decode(x[0].output_token_ids, { skip_special_tokens: true }),
			});
		},
	});

	// Send the output back to the main thread
	self.postMessage({
		status: "complete",
		output: output,
		searchID: event.data.searchID,
	});
});
