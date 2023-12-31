<script lang="ts">
	import { marked } from "marked";
	import type { Message } from "$lib/types/Message";
	import { afterUpdate, createEventDispatcher } from "svelte";
	import { deepestChild } from "$lib/utils/deepestChild";
	import { page } from "$app/stores";

	import CodeBlock from "../CodeBlock.svelte";
	import IconLoading from "../icons/IconLoading.svelte";
	import CarbonRotate360 from "~icons/carbon/rotate-360";
	import CarbonDownload from "~icons/carbon/download";
	import CarbonThumbsUp from "~icons/carbon/thumbs-up";
	import CarbonThumbsDown from "~icons/carbon/thumbs-down";
	import { PUBLIC_SEP_TOKEN } from "$lib/constants/publicSepToken";
	import type { Model } from "$lib/types/Model";
	import type { WebSearchMessage } from "$lib/types/WebSearch";

	import OpenWebSearchResults from "../OpenWebSearchResults.svelte";

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
	export let loading = false;
	export let isAuthor = true;
	export let readOnly = false;
	export let isTapped = false;

	export let webSearchMessages: WebSearchMessage[] = [];

	const dispatch = createEventDispatcher<{
		retry: { content: string; id: Message["id"] };
		vote: { score: Message["score"]; id: Message["id"] };
	}>();

	let contentEl: HTMLElement;
	let loadingEl: IconLoading;
	let pendingTimeout: ReturnType<typeof setTimeout>;

	const renderer = new marked.Renderer();

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
		class="group relative -mb-8 flex items-start justify-start gap-4 pb-8 leading-relaxed max-w-[80%]"
		on:click={() => (isTapped = !isTapped)}
		on:keypress={() => (isTapped = !isTapped)}
	>
		<img
			alt=""
			src="https://huggingface.co/avatars/2edb18bd0206c16b433841a47f53fa8e.svg"
			class="mt-5 h-3 w-3 flex-none select-none rounded-full shadow-lg"
		/>
		<div
			class="bg-ai-chat relative min-h-[calc(2rem+theme(spacing[3.5])*2)] min-w-[60px] break-words rounded-2xl border border-gray-100 px-5 py-3.5 prose-pre:my-2 dark:border-gray-800 dark:from-gray-800/40 text-white"
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
				class="prose max-w-none dark:prose-invert max-sm:prose-sm prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-h3:text-base prose-pre:bg-gray-800 dark:prose-pre:bg-gray-900 text-white"
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
		</div>
	</div>
{/if}
{#if message.from === "user"}
	<div class="group relative flex items-start justify-end gap-4">
		<div class="mt-5 h-3 w-3 flex-none rounded-full" />
		<div
			class="bg-user-chat max-w-[80%] whitespace-break-spaces break-words rounded-2xl px-5 py-3.5 text-white prose dark:prose-invert max-sm:prose-sm prose-headings:font-semibold prose-h1:text-lg prose-h2:text-base prose-h3:text-base prose-pre:bg-gray-900 text-white"
		>
			{message.content.trim()}
		</div>
		{#if !loading}
			<div class="absolute right-0 top-3.5 flex gap-2 lg:-right-2" />
		{/if}
	</div>
{/if}
