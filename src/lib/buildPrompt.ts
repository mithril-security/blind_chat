import type { BackendModel } from "./server/models";
import type { Message } from "./types/Message";
import { collections } from "$lib/server/database";
import { authCondition } from "./server/auth";
/**
 * Convert [{user: "assistant", content: "hi"}, {user: "user", content: "hello"}] to:
 *
 * <|assistant|>hi<|endoftext|><|prompter|>hello<|endoftext|><|assistant|>
 */

interface buildPromptOptions {
	messages: Pick<Message, "from" | "content">[];
	model: BackendModel;
	locals?: App.Locals;
	webSearchId?: string;
	preprompt?: string;
}

export async function buildPrompt({
	messages,
	model,
	locals,
	webSearchId,
	preprompt,
}: buildPromptOptions): Promise<string> {
	return (
		model
			.chatPromptRender({ messages, preprompt })
			// Not super precise, but it's truncated in the model's backend anyway
			.split(" ")
			.slice(-(model.parameters?.truncate ?? 0))
			.join(" ")
	);
}
