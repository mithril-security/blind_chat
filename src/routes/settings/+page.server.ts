import { base } from "$app/paths";
import { collections } from "$lib/server/database";
import { redirect } from "@sveltejs/kit";
import { z } from "zod";
import { models, validateModel } from "$lib/server/models";
import { authCondition } from "$lib/server/auth";
import { DEFAULT_SETTINGS } from "$lib/types/Settings";

export const actions = {
	default: async function ({ request, locals }) {
		const formData = await request.formData();

		const { ethicsModalAccepted, ...settings } = z
			.object({
				shareConversationsWithModelAuthors: z
					.union([z.literal("true"), z.literal("on"), z.literal("false"), z.null()])
					.transform((value) => {
						return value === "true" || value === "on";
					}),
				ethicsModalAccepted: z.boolean({ coerce: true }).optional(),
				activeModel: validateModel(models),
				customPrompts: z.record(z.string()).default({}),
			})
			.parse({
				shareConversationsWithModelAuthors: formData.get("shareConversationsWithModelAuthors"),
				ethicsModalAccepted: formData.get("ethicsModalAccepted"),
				activeModel: formData.get("activeModel") ?? DEFAULT_SETTINGS.activeModel,
				customPrompts: JSON.parse(formData.get("customPrompts")?.toString() ?? "{}"),
			});

		throw redirect(303, request.headers.get("referer") || `${base}/`);
	},
};
