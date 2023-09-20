import { collections } from "$lib/server/database";
import { hashConv } from "$lib/utils/hashConv.js";
import { error } from "@sveltejs/kit";

export async function GET({ params, locals }) {
	return new Response(JSON.stringify(""), { headers: { "Content-Type": "application/json" } });
}
