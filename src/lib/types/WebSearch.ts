import type { Conversation } from "./Conversation";
import type { Timestamps } from "./Timestamps";

export interface WebSearch extends Timestamps {
	prompt: string;

	searchQuery: string;
	results: string[];
	knowledgeGraph: string;
	answerBox: string;
	summary: string;

	messages: WebSearchMessage[];
}

export type WebSearchMessageUpdate = {
	type: "update";
	message: string;
	args?: string[];
};

export type WebSearchMessageError = {
	type: "error";
	message: string;
	args?: string[];
};

export type WebSearchMessageResult = {
	type: "result";
	id: string;
};

export type WebSearchMessage =
	| WebSearchMessageUpdate
	| WebSearchMessageResult
	| WebSearchMessageError;
