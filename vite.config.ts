import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig, searchForWorkspaceRoot } from "vite";
import Icons from "unplugin-icons/vite";

export default defineConfig({
	plugins: [
		sveltekit(),
		Icons({
			compiler: "svelte",
		}),
	],
	server: {
		fs: {
			allow: [
				// your custom rules
				"/models/Xenova/LaMini-Flan-T5-783M/onnx/decoder_model_merged_quantized.onnx",
				"/models/Xenova/LaMini-Flan-T5-783M/onnx/encoder_model_quantized.onnx",
			],
		},
	},
});
