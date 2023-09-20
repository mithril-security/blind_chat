import type { Message } from "./Message";
import type { Timestamps } from "./Timestamps";
import type { User } from "./User";

export interface Conversation extends Timestamps {
	sessionId?: string;
	userId?: User["_id"];

	model: string;

	title: string;
	messages: Message[];

	meta?: {
		fromShareId?: string;
	};
}
