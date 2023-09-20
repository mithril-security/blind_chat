import type { Timestamps } from "./Timestamps";

export interface User extends Timestamps {
	username?: string;
	name: string;
	email?: string;
	avatarUrl: string;
	hfUserId: string;

	// Session identifier, stored in the cookie
	sessionId: string;
}
