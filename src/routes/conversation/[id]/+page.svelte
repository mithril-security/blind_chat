<script lang="ts">
	import ChatWindow from "$lib/components/chat/ChatWindow.svelte";
	import { pendingMessage } from "$lib/stores/pendingMessage";
	import { pendingMessageIdToRetry } from "$lib/stores/pendingMessageIdToRetry";
	import { onMount } from "svelte";
	import { page } from "$app/stores";
	import { invalidate } from "$app/navigation";
	import { base } from "$app/paths";
	import { shareConversation } from "$lib/shareConversation";
	import { UrlDependency } from "$lib/types/UrlDependency";
	import { ERROR_MESSAGES, error } from "$lib/stores/errors";
	import { randomUUID } from "$lib/utils/randomUuid";
	import { findCurrentModel } from "$lib/utils/models";
	import { webSearchParameters } from "$lib/stores/webSearchParameters";
	import type { WebSearchMessage } from "$lib/types/WebSearch";
	import type { Message } from "$lib/types/Message";
	import { PUBLIC_APP_DISCLAIMER } from "$env/static/public";
	import { pipeline, Pipeline, env as env_transformers } from "@xenova/transformers";
	import { isloading_writable } from "../../LayoutWritable.js";
	import { map_writable } from "$lib/components/LoadingModalWritable.js";
	import { params_writable } from "./ParamsWritable.js";
	import { addMessageToChat,getChats,getMessages,getTitle } from "../../LocalDB.js";
	import { env } from "$env/dynamic/public";
	export let data;

	let pipelineWorker;

	let pipe: Pipeline;

	let id = ""

	let title_ret = env.PUBLIC_APP_NAME

	let messages = [];
	let lastLoadedMessages = [];
	let isAborted = false;

	console.log(" - " + $page.params.id)

	let webSearchMessages: WebSearchMessage[] = [];

	// // Since we modify the messages array locally, we don't want to reset it if an old version is passed
	// $: if (data.messages !== lastLoadedMessages) {
	// 	messages = data.messages;
	// 	lastLoadedMessages = data.messages;
	// }

	let loading = false;
	let pending = false;
	let loginRequired = false;

	// Create a callback function for messages from the worker thread.
	const onMessageReceived = (e) => {
		let lastMessage: any = undefined;
		switch (e.data.status) {
			case "initiate":
				break;

			case "progress":
				isloading_writable.set(true);
				map_writable.set([e.data.file, e.data.progress]);
				break;

			case "done":
				break;

			case "ready":
				isloading_writable.set(false);
				break;

			case "update":
				if (lastMessage == undefined) lastMessage = messages[messages.length - 1];
				lastMessage.content = e.data.output;
				lastMessage.webSearchId = e.data.searchID;
				lastMessage.updatedAt = new Date()
				messages = [...messages];
				break;

			case "complete":
				lastMessage = messages[messages.length - 1];
				lastMessage.webSearchId = e.data.searchID;
				lastMessage.updatedAt = new Date()
				addMessageToChat($page.params.id, lastMessage)
				messages = [...messages];
				lastMessage = undefined;
				loading = false;
				pending = false;
				webSearchMessages = [];

				if (messages.filter((m) => m.from === "user").length === 1) {
					invalidate(UrlDependency.ConversationList).catch(console.error);
				} else {
					invalidate(UrlDependency.ConversationList).then((value) => {
						console.log(value);
					});
				}
				break;
		}
	};

	async function getTextGenerationStream(
		inputs: string,
		messageId: string,
		isRetry = false,
		webSearchId?: string
	) {
		let conversationId = $page.params.id;
		const responseId = randomUUID();

		let opt = "";

		messages = [
			...messages,
			// id doesn't match the backend id but it's not important for assistant messages
			{ from: "assistant", content: "", id: responseId, createdAt: new Date(), updatedAt: new Date() },
		];

		let msg = 
		{
				content: inputs,
				from: "user",
				id: randomUUID(),
				createdAt: new Date(),
				updatedAt: new Date(),
		};

		console.log(findCurrentModel([...data.models, ...data.oldModels], data.settings.activeModel))

		addMessageToChat(conversationId, msg)

		let lastMessage = messages[messages.length - 1];
		pipelineWorker.postMessage({ text: inputs, webSearchId: webSearchId, conversationId: conversationId });
	}

	async function summarizeTitle(id: string) {
		await fetch(`${base}/conversation/${id}/summarize`, {
			method: "POST",
		});
	}

	async function writeMessage(message: string, messageId = randomUUID()) {
		if (!message.trim()) return;

		try {
			isAborted = false;
			loading = true;
			pending = true;

			let retryMessageIndex = messages.findIndex((msg) => msg.id === messageId);
			const isRetry = retryMessageIndex !== -1;
			if (!isRetry) {
				retryMessageIndex = messages.length;
			}

			messages = [
				...messages.slice(0, retryMessageIndex),
				{ from: "user", content: message, id: messageId },
			];

			let searchResponseId: string | null = "";
			if ($webSearchParameters.useSearch) {
				webSearchMessages = [];

				const res = await fetch(
					`${base}/conversation/${$page.params.id}/web-search?` +
						new URLSearchParams({ prompt: message }),
					{
						method: "GET",
					}
				);

				// required bc linting doesn't see TextDecoderStream for some reason?
				// eslint-disable-next-line no-undef
				const encoder = new TextDecoderStream();
				const reader = res?.body?.pipeThrough(encoder).getReader();

				while (searchResponseId === "") {
					await new Promise((r) => setTimeout(r, 25));

					if (isAborted) {
						reader?.cancel();
						return;
					}

					reader
						?.read()
						.then(async ({ done, value }) => {
							if (done) {
								reader.cancel();
								return;
							}

							try {
								webSearchMessages = (JSON.parse(value) as { messages: WebSearchMessage[] })
									.messages;
							} catch (parseError) {
								// in case of parsing error we wait for the next message
								return;
							}

							const lastSearchMessage = webSearchMessages[webSearchMessages.length - 1];
							if (lastSearchMessage.type === "result") {
								searchResponseId = lastSearchMessage.id;
								reader.cancel();
								return;
							}
						})
						.catch(() => {
							searchResponseId = null;
						});
				}
			}

			await getTextGenerationStream(message, messageId, isRetry, searchResponseId ?? undefined);
			title_ret = await getTitle($page.params.id)
		} catch (err) {
			if (err instanceof Error && err.message.includes("overloaded")) {
				$error = "Too much traffic, please try again.";
			} else if (err instanceof Error && err.message.includes("429")) {
				$error = ERROR_MESSAGES.rateLimited;
			} else if (err instanceof Error) {
				$error = err.message;
			} else {
				$error = ERROR_MESSAGES.default;
			}
			console.error(err);
		} finally {
			loading = false;
			pending = false;
		}
	}

	async function voteMessage(score: Message["score"], messageId: string) {
		let conversationId = $page.params.id;
		let oldScore: Message["score"] | undefined;

		// optimistic update to avoid waiting for the server
		messages = messages.map((message) => {
			if (message.id === messageId) {
				oldScore = message.score;
				return { ...message, score: score };
			}
			return message;
		});

		try {
			await fetch(`${base}/conversation/${conversationId}/message/${messageId}/vote`, {
				method: "POST",
				body: JSON.stringify({ score }),
			});
		} catch {
			// revert score on any error
			messages = messages.map((message) => {
				return message.id !== messageId ? message : { ...message, score: oldScore };
			});
		}
	}

	params_writable.subscribe(async (value) => {
			if (value != id) {
				id = value
				title_ret = await getTitle(value)
				let res = await getMessages(value)

				if (res != undefined) {
					messages = res
					lastLoadedMessages = res
				}
			}
	});

	onMount(async () => {
		const Worker = await import("./worker.js?worker");
		pipelineWorker = new Worker.default();
		
		title_ret = await getTitle($page.params.id)
		let res = await getMessages($page.params.id)

		id = $page.params.id
		
		if (res != undefined) {
				messages = res
				lastLoadedMessages = res
		}

		pipelineWorker.addEventListener("message", onMessageReceived);

		if ($pendingMessage) {
			const val = $pendingMessage;
			const messageId = $pendingMessageIdToRetry || undefined;
			$pendingMessage = "";
			$pendingMessageIdToRetry = null;

			writeMessage(val, messageId);
		}
	});
	$: $page.params.id, (isAborted = true);
	$: title = title_ret;

	$: loginRequired =
		(data.requiresLogin
			? !data.user
			: !data.settings.ethicsModalAcceptedAt && !!PUBLIC_APP_DISCLAIMER) &&
		messages.length >= data.messagesBeforeLogin;
</script>

<svelte:head>
	<title>{title}</title>
</svelte:head>

<ChatWindow
	{loading}
	{pending}
	{messages}
	bind:webSearchMessages
	searches={{ ...data.searches }}
	on:message={(event) => writeMessage(event.detail)}
	on:retry={(event) => writeMessage(event.detail.content, event.detail.id)}
	on:vote={(event) => voteMessage(event.detail.score, event.detail.id)}
	on:share={() => shareConversation($page.params.id, data.title)}
	on:stop={() => (isAborted = true)}
	models={data.models}
	currentModel={findCurrentModel([...data.models, ...data.oldModels], data.model)}
	settings={data.settings}
	{loginRequired}
/>
