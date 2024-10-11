import { COOKIE_NAME, MESSAGES_BEFORE_LOGIN } from "$env/static/private";
import { env } from "$env/dynamic/private";
import type { Handle } from "@sveltejs/kit";
import {
	PUBLIC_GOOGLE_ANALYTICS_ID,
	PUBLIC_DEPRECATED_GOOGLE_ANALYTICS_ID,
	PUBLIC_ORIGIN,
	PUBLIC_APP_DISCLAIMER,
} from "$env/static/public";
import { collections } from "$lib/server/database";
import { base } from "$app/paths";
import { refreshSessionCookie, requiresUser } from "$lib/server/auth";
import { ERROR_MESSAGES } from "$lib/stores/errors";
import { models } from "./lib/server/models";

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get(COOKIE_NAME);

	event.locals.sessionId = token || crypto.randomUUID();

	function errorResponse(status: number, message: string) {
		const sendJson =
			event.request.headers.get("accept")?.includes("application/json") ||
			event.request.headers.get("content-type")?.includes("application/json");
		return new Response(sendJson ? JSON.stringify({ error: message }) : message, {
			status,
			headers: {
				"content-type": sendJson ? "application/json" : "text/plain",
			},
		});
	}

	// CSRF protection
	const requestContentType = event.request.headers.get("content-type")?.split(";")[0] ?? "";
	/** https://developer.mozilla.org/en-US/docs/Web/HTML/Element/form#attr-enctype */
	const nativeFormContentTypes = [
		"multipart/form-data",
		"application/x-www-form-urlencoded",
		"text/plain",
	];
	if (event.request.method === "POST" && nativeFormContentTypes.includes(requestContentType)) {
		const referer = event.request.headers.get("referer");

		if (!referer) {
			return errorResponse(403, "Non-JSON form requests need to have a referer");
		}

		const validOrigins = [
			new URL(event.request.url).origin,
			...(PUBLIC_ORIGIN ? [new URL(PUBLIC_ORIGIN).origin] : []),
		];

		if (!validOrigins.includes(new URL(referer).origin)) {
			return errorResponse(403, "Invalid referer for POST request");
		}
	}

	// if (
	// 	!event.url.pathname.startsWith(`${base}/login`) &&
	// 	!event.url.pathname.startsWith(`${base}/admin`) &&
	// 	!["GET", "OPTIONS", "HEAD"].includes(event.request.method)
	// ) {
	// 	if (
	// 		!user &&
	// 		requiresUser &&
	// 		!((MESSAGES_BEFORE_LOGIN ? parseInt(MESSAGES_BEFORE_LOGIN) : 0) > 0)
	// 	) {
	// 		return errorResponse(401, ERROR_MESSAGES.authOnly);
	// 	}

	// 	// if login is not required and the call is not from /settings and we display the ethics modal with PUBLIC_APP_DISCLAIMER
	// 	//  we check if the user has accepted the ethics modal first.
	// 	// If login is required, `ethicsModalAcceptedAt` is already true at this point, so do not pass this condition. This saves a DB call.
	// 	if (
	// 		!requiresUser &&
	// 		!event.url.pathname.startsWith(`${base}/settings`) &&
	// 		!!PUBLIC_APP_DISCLAIMER
	// 	) {
	// 		const hasAcceptedEthicsModal = await collections.settings.countDocuments({
	// 			sessionId: event.locals.sessionId,
	// 			ethicsModalAcceptedAt: { $exists: true },
	// 		});

	// 		if (!hasAcceptedEthicsModal) {
	// 			return errorResponse(405, "You need to accept the welcome modal first");
	// 		}
	// 	}
	// }

	const modelsEnv = process.env.MODELS;	
	if (modelsEnv) {
	  try {
		const modelsData = JSON.parse(modelsEnv);
		if (modelsData.length > 0) {
			modelsData[0].name = process.env.MODEL_NAME || modelsData[0].name;
			modelsData[0].is_local = process.env.IS_LOCAL || modelsData[0].is_local;
			modelsData[0].is_code = process.env.IS_CODE || modelsData[0].is_code;
			modelsData[0].type = process.env.MODEL_TYPE || modelsData[0].type;
			modelsData[0].userMessageToken = process.env.USER_MESSAGE_TOKEN || modelsData[0].userMessageToken;
			modelsData[0].assistantMessageToken = process.env.ASSISTANT_MESSAGE_TOKEN || modelsData[0].assistantMessageToken;
			modelsData[0].messageEndToken = process.env.MESSAGE_END_TOKEN || modelsData[0].messageEndToken;
			modelsData[0].preprompt = process.env.PREPROMPT || modelsData[0].preprompt;
			modelsData[0].server_addr = process.env.SERVER_ADDR || modelsData[0].server_addr;
			modelsData[0].promptExamples[0] = process.env.PROMPT_1
			? { title: process.env.PROMPT_1, prompt: process.env.PROMPT_1 } : modelsData[0].promptExamples[0];
			modelsData[0].promptExamples[1] = process.env.PROMPT_2
			? { title: process.env.PROMPT_2, prompt: process.env.PROMPT_2 } : modelsData[0].promptExamples[1];
			modelsData[0].promptExamples[2] = process.env.PROMPT_3
			? { title: process.env.PROMPT_3, prompt: process.env.PROMPT_3 } : modelsData[0].promptExamples[2];
			modelsData[0].parameters = {
				temperature: process.env.TEMPERATURE !== undefined ? parseFloat(process.env.TEMPERATURE) : modelsData[0].parameters.temperature,
				top_p: process.env.TOP_P !== undefined ? parseFloat(process.env.TOP_P) : modelsData[0].parameters.top_p,
				repetition_penalty: process.env.REPETITION_PENALTY !== undefined ? parseFloat(process.env.REPETITION_PENALTY) : modelsData[0].parameters.repetition_penalty,
				top_k: process.env.TOP_K !== undefined ? parseInt(process.env.TOP_K) : modelsData[0].parameters.top_k,
				truncate: process.env.TRUNCATE !== undefined ? parseInt(process.env.TRUNCATE) : modelsData[0].parameters.truncate,
				max_new_tokens: process.env.MAX_NEW_TOKENS !== undefined ? parseInt(process.env.MAX_NEW_TOKENS) : modelsData[0].parameters.max_new_tokens,
			};
			models[0] = modelsData[0];

		}
	  } catch (error) {
		console.error('Error parsing MODELS environment variable:', error);
	  }
	}
	
	refreshSessionCookie(event.cookies, event.locals.sessionId);

	let replaced = false;

	const response = await resolve(event, {
		transformPageChunk: (chunk) => {
			// For some reason, Sveltekit doesn't let us load env variables from .env in the app.html template
			if (replaced || !chunk.html.includes("%gaId%") || !chunk.html.includes("%gaIdDeprecated%")) {
				return chunk.html;
			}
			replaced = true;

			return chunk.html
				.replace("%gaId%", PUBLIC_GOOGLE_ANALYTICS_ID)
				.replace("%gaIdDeprecated%", PUBLIC_DEPRECATED_GOOGLE_ANALYTICS_ID);
		},
	});

	return response;
};
