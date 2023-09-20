import { collections } from "$lib/server/database";
import { error } from "@sveltejs/kit";
import { authCondition } from "$lib/server/auth";
import type { WebSearchMessageResult } from "$lib/types/WebSearch";
import { UrlDependency } from "$lib/types/UrlDependency";

export const load = async ({ params, depends, locals }) => {
	return {
		title: "Untitled",
		model: "",
		searches: undefined,
	};
};
