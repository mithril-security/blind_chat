import { redirect } from "@sveltejs/kit";
import type { LayoutServerLoad } from "./$types";
import { collections } from "$lib/server/database";
import type { Conversation } from "$lib/types/Conversation";
import { UrlDependency } from "$lib/types/UrlDependency";
import { defaultModel, models, oldModels, validateModel } from "$lib/server/models";
import { authCondition, requiresUser } from "$lib/server/auth";
import { DEFAULT_SETTINGS } from "$lib/types/Settings";
import { SERPAPI_KEY, SERPER_API_KEY, MESSAGES_BEFORE_LOGIN } from "$env/static/private";

export const load: LayoutServerLoad = async ({ locals, depends, url }) => {
	const { conversations } = collections;
	const urlModel = url.searchParams.get("model");

	depends(UrlDependency.ConversationList);

	if (urlModel) {
		const isValidModel = validateModel(models).safeParse(urlModel).success;

		if (isValidModel) {
			await collections.settings.updateOne(
				authCondition(locals),
				{ $set: { activeModel: urlModel } },
				{ upsert: true }
			);
		}

		throw redirect(302, url.pathname);
	}

	const settings = await collections.settings.findOne(authCondition(locals));

	// If the active model in settings is not valid, set it to the default model. This can happen if model was disabled.
	if (settings && !validateModel(models).safeParse(settings?.activeModel).success) {
		settings.activeModel = defaultModel.id;
		await collections.settings.updateOne(authCondition(locals), {
			$set: { activeModel: defaultModel.id },
		});
	}

	return {
		conversations: [],
		settings: {
			shareConversationsWithModelAuthors:
				settings?.shareConversationsWithModelAuthors ??
				DEFAULT_SETTINGS.shareConversationsWithModelAuthors,
			ethicsModalAcceptedAt: settings?.ethicsModalAcceptedAt ?? null,
			activeModel: settings?.activeModel ?? DEFAULT_SETTINGS.activeModel,
			searchEnabled: !!(SERPAPI_KEY || SERPER_API_KEY),
			customPrompts: settings?.customPrompts ?? {},
		},
		models: models.map((model) => ({
			id: model.id,
			name: model.name,
			websiteUrl: model.websiteUrl,
			modelUrl: model.modelUrl,
			is_local: model.is_local,
			datasetName: model.datasetName,
			datasetUrl: model.datasetUrl,
			displayName: model.displayName,
			description: model.description,
			promptExamples: model.promptExamples,
			parameters: model.parameters,
			preprompt: model.preprompt,
		})),
		oldModels,
		user: locals.user && {
			username: locals.user.username,
			avatarUrl: locals.user.avatarUrl,
			email: locals.user.email,
		},
		requiresLogin: requiresUser,
		messagesBeforeLogin: MESSAGES_BEFORE_LOGIN ? parseInt(MESSAGES_BEFORE_LOGIN) : 0,
	};
};
