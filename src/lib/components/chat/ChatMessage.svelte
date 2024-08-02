<script lang="ts">
	import { marked } from "marked";
	import type { Message } from "$lib/types/Message";
	import { afterUpdate, createEventDispatcher } from "svelte";

	import { page } from "$app/stores";

	import CodeBlock from "../CodeBlock.svelte";
	import IconLoading from "../icons/IconLoading.svelte";

	import { PUBLIC_SEP_TOKEN } from "$lib/constants/publicSepToken";
	import { base } from "$app/paths";
	import type { Model } from "$lib/types/Model";
	import type { WebSearchMessage } from "$lib/types/WebSearch";

	import OpenWebSearchResults from "../OpenWebSearchResults.svelte";
	import { PUBLIC_APP_ASSETS, PUBLIC_ORIGIN } from "$env/static/public";
	import { fade, scale } from "svelte/transition";

	function sanitizeMd(md: string) {
		let ret = md
			.replace(/<\|[a-z]*$/, "")
			.replace(/<\|[a-z]+\|$/, "")
			.replace(/<$/, "")
			.replaceAll(PUBLIC_SEP_TOKEN, " ")
			.replaceAll(/<\|[a-z]+\|>/g, " ")
			.replaceAll(/<br\s?\/?>/gi, "\n")
			.replaceAll("<", "&lt;")
			.trim();

		return ret;
	}
	function unsanitizeMd(md: string) {
		if (md != undefined) return md.replaceAll("&lt;", "<");
		else return "";
	}

	export let model: Model;
	export let message: Message;
	export let messages: Message[];
	export let loading = false;
	export let isAuthor = true;
	export let readOnly = false;
	export let isTapped = false;
	export let webSearchMessages: WebSearchMessage[] = [];

	$: messagesAi = messages?.filter((mess) => mess.from === "assistant") || [];
	const findIndexMessageAi = (id: Message["id"]) => {
		return messagesAi?.findIndex((mess) => mess.id === id);
	};
	let showCopyToast = false;
	const dispatch = createEventDispatcher<{
		retry: { content: string; id: Message["id"] };
		vote: { score: Message["score"]; id: Message["id"] };
	}>();
	const copyMessage = (id: Message["id"]) => {
		console.log(document.getElementById(id));
		const texte = document.getElementById(id)?.innerText;
		console.log(texte);
		if (texte) {
			// Créez un élément textarea temporaire
			const textarea = document.createElement("textarea");
			textarea.value = texte;

			// Ajoutez le textarea au document
			document.body.appendChild(textarea);

			// Sélectionnez le contenu du textarea
			textarea.select();
			textarea.setSelectionRange(0, 99999); // Pour les appareils mobiles
			document.execCommand("copy");
			showCopyToast = true;

			setTimeout(() => (showCopyToast = false), 1500);

			// Supprimez le textarea temporaire
			document.body.removeChild(textarea);
		}
	};
	let contentEl: HTMLElement;
	let loadingEl: IconLoading;
	let pendingTimeout: ReturnType<typeof setTimeout>;

	const renderer = new marked.Renderer();
	// const retryMessage = () => {

	// 	const indexMessage = messages.findIndex((mess) => mess.id === message.id);
	// 	if(!indexMessage) return
	// 	const previousMessage = messages[indexMessage - 1];
	// 	if(!previousMessage) return
	// 	dispatch("retry", { content: previousMessage.content, id: previousMessage.id });
	// };
	// For code blocks with simple backticks
	renderer.codespan = (code) => {
		// Unsanitize double-sanitized code
		return `<code>${code.replaceAll("&amp;", "&")}</code>`;
	};

	const options: marked.MarkedOptions = {
		...marked.getDefaults(),
		gfm: true,
		breaks: true,
		renderer,
	};

	$: tokens = marked.lexer(sanitizeMd(message.content));

	afterUpdate(() => {
		loadingEl?.$destroy();
		clearTimeout(pendingTimeout);

		// Add loading animation to the last message if update takes more than 600ms
		// if (loading) {
		// 	pendingTimeout = setTimeout(() => {
		// 		if (contentEl) {
		// 			loadingEl = new IconLoading({
		// 				target: deepestChild(contentEl),
		// 				props: { classNames: "loading inline ml-2" },
		// 			});
		// 		}
		// 	}, 600);
		// }
	});

	let webSearchIsDone = true;

	$: webSearchIsDone =
		webSearchMessages.length > 0 &&
		webSearchMessages[webSearchMessages.length - 1].type === "result";
</script>

{#if message.from === "assistant"}
	<div
		class="group relative -mb-8 flex max-w-[80%] items-start justify-start gap-4 pb-8 leading-relaxed"
		on:click={() => (isTapped = !isTapped)}
		on:keypress={() => (isTapped = !isTapped)}
	>
		<div
			class="relative min-h-[calc(2rem+theme(spacing[3.5])*2)] min-w-[60px] break-words rounded-br-[32px] rounded-tl-[32px] rounded-tr-[32px] bg-tertiary px-5 py-3.5  {message.content
				? 'pb-9'
				: ''}  text-white prose-pre:my-2"
		>
			{#if webSearchMessages && webSearchMessages.length > 0}
				<OpenWebSearchResults
					classNames={tokens.length ? "mb-3.5" : ""}
					{webSearchMessages}
					loading={!webSearchIsDone}
				/>
			{/if}
			{#if !message.content && (webSearchIsDone || (webSearchMessages && webSearchMessages.length === 0))}
				<IconLoading />
			{/if}

			<div
				id={message.id}
				class="prose max-w-none text-white dark:prose-invert max-sm:prose-sm prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-h3:text-base prose-pre:bg-gray-800 dark:prose-pre:bg-gray-900"
				bind:this={contentEl}
			>
				{#each tokens as token}
					{#if token.type === "code"}
						<CodeBlock lang={token.lang} code={unsanitizeMd(token.text)} />
					{:else}
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html marked(token.raw, options)}
					{/if}
				{/each}
			</div>
			{#if message.content}
				<div class=" absolute bottom-0 w-full">
					<div class="flex justify-end items-center gap-0.5 pr-10 pb-1.5">
					
							<img
								alt="regenerate message"
								title="Regenerate response"
								src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/regenerate.png"
								class="customHover transform translate-y-[-2px]  h-[26px] w-[26px] cursor-pointer"
							/>
							<span class=" text-sm text-newPrimary font-light">
								{findIndexMessageAi(message.id) + 1}/{messagesAi?.length}
							</span>
					
					</div>
				</div>

				<img
					alt="copy message"
					title="Copy message"
					on:keypress
					on:click={() => copyMessage(message.id)}
					src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/copy.png"
					class="group-hover:visible invisible blueImg customHover absolute bottom-0 right-[-22px] h-[22px] w-[22px] cursor-pointer p-0"
				/>
			{/if}
		</div>
	</div>
{/if}
{#if message.from === "user"}
	<div class="group relative flex items-start justify-end gap-4">
		<div class="mt-5 h-3 w-3 flex-none rounded-full" />
		<div
			class="prose relative max-w-[80%] whitespace-break-spaces break-words rounded-bl-[32px] rounded-tl-[32px] rounded-tr-[32px] bg-secondary px-5 py-3.5 text-customBlack dark:prose-invert max-sm:prose-sm prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-h3:text-base prose-pre:bg-gray-900"
		>
			<span id={message.id}>{message.content.trim()}</span>

			<img
				on:keypress
				on:click={() => copyMessage(message.id)}
				title="Copy message"
				alt="copy message"
				src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/copy.png"
				class="group-hover:visible invisible customHover blueImg absolute bottom-0 left-[-22px] h-[22px] w-[22px] cursor-pointer p-0"
			/>
		</div>
		{#if !loading}
			<div class="absolute right-0 top-3.5 flex gap-2 lg:-right-2" />
		{/if}
	</div>
{/if}

{#if showCopyToast}
	<div
		transition:scale
		class="fixed bottom-4 right-4 z-10 rounded bg-green-500 px-4 py-2 text-white shadow-md"
	>
		Text copied
	</div>
{/if}


