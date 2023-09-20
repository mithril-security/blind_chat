import { buildPrompt } from "$lib/buildPrompt";
import { authCondition } from "$lib/server/auth";
import { collections } from "$lib/server/database";
import { models } from "$lib/server/models";
import { error } from "@sveltejs/kit";

export async function GET({ params, locals }) {
	return new Response(
		JSON.stringify(
			{
				note: "This is a preview of the prompt that will be sent to the model when retrying the message. It may differ from what was sent in the past if the parameters have been updated since",
				prompt,
				model: "",
				parameters: {
					return_full_text: false,
				},
			},
			null,
			2
		),
		{ headers: { "Content-Type": "application/json" } }
	);
}
