import { base } from "$app/paths";
import { authCondition } from "$lib/server/auth";
import { collections } from "$lib/server/database";
import { redirect } from "@sveltejs/kit";

export const actions = {
	delete: async function ({ locals }) {
		throw redirect(303, `${base}/`);
	},
};
