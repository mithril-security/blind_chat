// Shouldn't be needed if we dove into sveltekit internals, see https://github.com/huggingface/chat-ui/pull/88#issuecomment-1523173850

import { setTimeout } from "node:timers/promises";
import { collections } from "./database";

let closed = false;
process.on("SIGINT", () => {
	closed = true;
});

export let abortedGenerations: Map<string, Date> = new Map();

async function maintainAbortedGenerations() {
	while (!closed) {
		await setTimeout(1000);

		try {
			const aborts = collections?.abortedGenerations;
			if (!aborts) return;
			const sortedAborts = aborts.find({}).sort({ createdAt: 1 }).toArray();
			abortedGenerations = new Map(
				sortedAborts.map(({ conversationId, createdAt }) => [conversationId.toString(), createdAt])
			);
		} catch (err) {
			console.error(err);
		}
	}
}

maintainAbortedGenerations();
