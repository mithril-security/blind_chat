<script lang="ts">
	import type { Message } from "$lib/types/Message";
	import { createEventDispatcher } from "svelte";
	import Help from "$lib/components/icons/Help.svelte"
	import CarbonSendAltFilled from "~icons/carbon/send-alt-filled";
	import CarbonStopFilledAlt from "~icons/carbon/stop-filled-alt";
	import EosIconsLoading from "~icons/eos-icons/loading";
	import CarbonClose from "~icons/carbon/close";
	import { helpMenu } from "../../../routes/LayoutWritable";
	import ChatMessages from "./ChatMessages.svelte";
	import ChatInput from "./ChatInput.svelte";
	import StopGeneratingBtn from "../StopGeneratingBtn.svelte";
	import type { Model } from "$lib/types/Model";
	import type { LayoutData } from "../../../routes/$types";
	import WebSearchToggle from "../WebSearchToggle.svelte";
	import type { WebSearchMessage } from "$lib/types/WebSearch";

	export let messages: Message[] = [];
	let isHelpMenuOpen: boolean = false;
	export let loading = false;
	export let pending = false;
	export let shared = false;
	export let currentModel: Model;
	export let models: Model[];
	export let settings: LayoutData["settings"];
	export let webSearchMessages: WebSearchMessage[] = [];
	export let searches: Record<string, WebSearchMessage[]> = {};

	export let loginRequired = false;
	$: isReadOnly = !models.some((model) => model.id === currentModel.id);

	let loginModalOpen = false;
	let message: string;
	
	helpMenu.subscribe((val) => {
		isHelpMenuOpen = val;
	})

	function closeHelpMenu() {
		helpMenu.set(false);
	}

	function toggleHelpMenu() {
		helpMenu.set(!isHelpMenuOpen);
		console.log($helpMenu);
	}

	function handleKeyDown(event: { key: string; }) {
    if (event.key === 'Enter') {
      toggleHelpMenu();
    }
  	}

	const dispatch = createEventDispatcher<{
		message: string;
		share: void;
		stop: void;
		retry: { id: Message["id"]; content: string };
	}>();

	const handleSubmit = () => {
		if (loading) return;
		dispatch("message", message);
		message = "";
	};
</script>

<div class="relative min-h-0 min-w-0">
	<div class="justify-center text-center items-center flex bg-bannerBack dark:bg-chat dark:border-0 border-b">
		<p class="p-3 text-black/white">
			🔒 Prompts are end-to-end protected.<br
			/>Not even Mithril Security can read or train on them. Learn more 
			<a
				href="https://www.mithrilsecurity.io/privacy-policy#new-pp"
				style="text-decoration: underline; color: #f0b92d;">here</a
			>.
		</p>
	</div>
	<ChatMessages
		{loading}
		{pending}
		{settings}
		{currentModel}
		{models}
		{messages}
		readOnly={isReadOnly}
		isAuthor={!shared}
		{webSearchMessages}
		{searches}
		on:message
		on:vote
		on:retry={(ev) => {
			if (!loading) dispatch("retry", ev.detail);
		}}
	/>
<div
		class="dark:via-gray-80 pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto flex w-full max-w-3xl flex-col items-center justify-center bg-gradient-to-t from-white via-white/80 to-white/0 px-3.5 py-4 dark:border-gray-800 dark:from-gray-900 dark:to-gray-900/0 max-md:border-t max-md:bg-white max-md:dark:bg-gray-900 sm:px-5 md:py-8 xl:max-w-4xl [&>*]:pointer-events-auto"
	>
		<div class="flex w-full pb-3 max-md:justify-between">
			{#if settings?.searchEnabled}
				<WebSearchToggle />
			{/if}
			{#if loading}
				<StopGeneratingBtn
					classNames={settings?.searchEnabled ? "md:-translate-x-1/2 md:mx-auto" : "mx-auto"}
					on:click={() => dispatch("stop")}
				/>
			{/if}
		</div>
		<form
			on:submit|preventDefault={handleSubmit}
			class="relative flex w-full max-w-4xl flex-1 items-center rounded-xl border bg-gray-100 focus-within:border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:focus-within:border-gray-500
			{isReadOnly ? 'opacity-30' : ''}"
		>
			<div class="flex w-full flex-1 border-none bg-transparent">
				<ChatInput
					placeholder="Type here"
					bind:value={message}
					on:submit={handleSubmit}
					on:keypress={() => {
						if (loginRequired) loginModalOpen = true;
					}}
					maxRows={4}
					disabled={isReadOnly}
				/>

				{#if loading}
					<button
						class="btn mx-1 my-1 inline-block h-[2.4rem] self-end rounded-lg bg-transparent p-1 px-[0.7rem] text-gray-400 enabled:hover:text-gray-700 disabled:opacity-60 enabled:dark:hover:text-gray-100 dark:disabled:opacity-40 md:hidden"
						on:click={() => dispatch("stop")}
					>
						<CarbonStopFilledAlt />
					</button>
					<div
						class="mx-1 my-1 hidden h-[2.4rem] items-center p-1 px-[0.7rem] text-gray-400 enabled:hover:text-gray-700 disabled:opacity-60 enabled:dark:hover:text-gray-100 dark:disabled:opacity-40 md:flex"
					>
						<EosIconsLoading />
					</div>
				{:else}
					<button
						class="btn mx-1 my-1 h-[2.4rem] self-end rounded-lg bg-transparent p-1 px-[0.7rem] text-gray-400 enabled:hover:text-gray-700 disabled:opacity-60 enabled:dark:hover:text-gray-100 dark:disabled:opacity-40"
						disabled={!message || isReadOnly}
						type="submit"
					>
						<CarbonSendAltFilled />
					</button>
				{/if}
			</div>
		</form>
		<div class="mt-2 flex justify-between self-stretch px-1 text-xs text-gray-400/90 max-sm:gap-2">
			<p>
				Model: <a
					href={currentModel.modelUrl || "https://huggingface.co/" + currentModel.name}
					target="_blank"
					rel="noreferrer"
					class="hover:underline">{currentModel.displayName}</a
				> <span class="max-sm:hidden">·</span><br class="sm:hidden" /> Generated content may be
				inaccurate or false.
				<br /><br /> 🔒 All conversations are end-to-end protected
			</p>
			<div
			class="rounded-2xl text-center bg-mini-sidemenu flex items-center justify-center group h-11 -lg font-semibold text-gray-400 hover:bg-gray-700"
			on:click={toggleHelpMenu}
			on:keydown={handleKeyDown}
			>
			<Help/>
			</div>

	</div>
		{#if messages.length}
			<script type="text/javascript">
				document.getElementById("banner").style.display = "block";
			</script>
		{:else}
			<script type="text/javascript">
				document.getElementById("banner").style.display = "none";
			</script>
		{/if}
		<!-- {#if messages.length}
			<button
				class="flex flex-none items-center hover:text-gray-400 hover:underline max-sm:rounded-lg max-sm:bg-gray-50 max-sm:px-2.5 dark:max-sm:bg-gray-800"
				type="button"
				on:click={() => dispatch("share")}
			>
				<CarbonExport class="text-[.6rem] sm:mr-1.5 sm:text-primary-500" />
				<div class="max-sm:hidden">Share this conversation</div>
			</button>
		{/if} -->
		{#if isHelpMenuOpen}
		<script type="text/javascript">
			document.getElementById("helpMenu").style.display = "block";
		</script>
			<div id="helpMenu" class="bottom-[45%] right-[0%] md:bottom-[45%] md:right-[0%] xl:bottom-[50%] xl:right-[-18%] py-2 border border-gray-600 flex justify-center items-center rounded-2xl bg-darkBackground {isHelpMenuOpen ? 'open' : ''}" style="position: absolute;">
				<div>
					<div class = "flex justify-end">
						<button type="button" class="pr-2 justify-end" on:click={closeHelpMenu}>
							<CarbonClose class="justify-end text-white" />
						</button>
					</div>
					<a href="https://www.mithrilsecurity.io/contact" target="_blank" rel="noopener noreferrer" class="px-8 block py-3 text-center h-11 text-white hover:bg-gray-600" style="width: 100%;">
					Help
					</a>
					<a href="https://1qdag6eehid.typeform.com/to/EFrGfL1u" target="_blank" rel="noopener noreferrer" class="px-8 block text-center h-11 py-3 text-white hover:bg-gray-600" style="width: 100%;">
					Give Feedback
					</a>
					<a href="https://www.mithrilsecurity.io/faq" target="_blank" rel="noopener noreferrer" class="block text-center h-11 py-3 text-white hover:bg-gray-600" style="width: 100%;">
					FAQ
					</a>
					<a href="https://github.com/mithril-security/blind_chat/issues" target="_blank" rel="noopener noreferrer" class="block text-center h-11 py-3 text-white hover:bg-gray-600" style="width: 100%;">
					Report an issue
					</a>
				</div>
			</div>
	{/if}
	</div>
	</div>
