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
	let isPrivacyBannerOpen: boolean = true;
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

	function closePrivacyBanner() {
		isPrivacyBannerOpen = false;
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
<div class="bg-chat relative min-h-0 min-w-0">
	<!-- {#if isPrivacyBannerOpen}
	<script type="text/javascript">
		document.getElementById("PrivacyBanner").style.display = "block";
	</script> -->
	<!-- <div class="bg-chat" id="privacy-banner">
		<div class="border-b border-gray-600 flex justify-between px-4">
			<div class="justify-center items-center text-center flex-1">
		<p class="px-4 py-3 text-black/white text-xs lg:text-base">
			🔒 Prompts are end-to-end protected.<br>
			Not even Mithril Security can read or train on them. Learn more 
			<a
				href="https://www.mithrilsecurity.io/privacy-policy#new-pp"
				target="_blank" 
				rel="noopener noreferrer"
				style="text-decoration: underline; color: #f0b92d;">here</a
			>.</p>
			</div>
		<button type="button" class="pt-2" style="align-self: flex-start;" on:click={closePrivacyBanner}>
			<CarbonClose class="text-white" />
		</button>
		</div>
	</div> -->
<!-- {/if} -->
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
	<!-- chat input background bg-gradient-to-t from-white via-white/80 to-white/0 -->
<div
		class="dark:bg-chat border-0 pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto flex w-full max-w-3xl flex-col items-center justify-center px-3.5 py-2 sm:px-5 md:pb-6 md:pt-4 xl:max-w-4xl [&>*]:pointer-events-auto"
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
			<div class="mt-2 flex justify-end self-stretch text-xs text-gray-400/90 max-sm:gap-2">
				<div
				class="pb-2 pr-2 rounded-2xl text-center flex items-center justify-end group h-11 -lg font-semibold text-gray-400 hover:bg-gray-700"
				on:click={toggleHelpMenu}
				on:keydown={handleKeyDown}
				>
				<Help/>
				</div>
			</div>
		</form>
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
			<div id="helpMenu" class="bottom-[80%] right-[0%] md:bottom-[45%] md:right-[0%] xl:bottom-[50%] xl:right-[-22%] p-2 border border-gray-600 flex justify-center items-center rounded-2xl bg-[#0d1830] {isHelpMenuOpen ? 'open' : ''}" style="position: absolute;">
				<div>
					<div class="justify-center items-center text-center flex-1">
					<div class="flex justify-between px-2">
					<a href="https://www.mithrilsecurity.io/contact" target="_blank" rel="noopener noreferrer" class="rounded-2xl px-8 block py-3 text-center h-11 text-white hover:bg-gray-600" style="width: 100%;">
					Help ⤵️
					</a>
					<button type="button" class="pt-2" style="align-self: flex-start;" on:click={closeHelpMenu}>
						<CarbonClose class="text-white" />
					</button>
					</div>
					</div>
					<!-- <a href="https://1qdag6eehid.typeform.com/to/EFrGfL1u" target="_blank" rel="noopener noreferrer" class="rounded-2xl px-8 block text-center h-11 py-3 text-white hover:bg-gray-600" style="width: 100%;">
					Give Feedback ⤵️
					</a> -->
					<a href="https://www.mithrilsecurity.io/faq" target="_blank" rel="noopener noreferrer" class="rounded-xl block text-center h-11 py-3 text-white hover:bg-gray-600" style="width: 100%;">
					FAQ ⤵️
					</a>
					<a href="https://github.com/mithril-security/blind_chat/issues" target="_blank" rel="noopener noreferrer" class="rounded-2xl block text-center h-11 pt-3 text-white hover:bg-gray-600" style="width: 100%;">
					Report an issue ⤵️
					</a>
				</div>
			</div>
	{/if}
	</div>
	</div>
