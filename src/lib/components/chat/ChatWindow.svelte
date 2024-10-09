<script lang="ts">
	import type { Message } from "$lib/types/Message";
	import { base } from "$app/paths";
	import { PUBLIC_APP_NAME, PUBLIC_ORIGIN, PUBLIC_APP_ASSETS } from "$env/static/public";
	import { createEventDispatcher } from "svelte";
	import Help from "$lib/components/icons/Help.svelte";
	import CarbonSendAltFilled from "~icons/carbon/send-alt-filled";
	import CarbonStopFilledAlt from "~icons/carbon/stop-filled-alt";
	import EosIconsLoading from "~icons/eos-icons/loading";
	import { page } from "$app/stores";
	import CarbonClose from "~icons/carbon/close";
	import { helpMenu } from "../../../routes/LayoutWritable";
	import ChatMessages from "./ChatMessages.svelte";
	import ChatInput from "./ChatInput.svelte";
	import StopGeneratingBtn from "../StopGeneratingBtn.svelte";
	import type { Model } from "$lib/types/Model";
	import type { LayoutData } from "../../../routes/$types";
	import WebSearchToggle from "../WebSearchToggle.svelte";
	import type { WebSearchMessage } from "$lib/types/WebSearch";
	import { scale } from "svelte/transition";

	export let messages: Message[] = [];
	let isHelpMenuOpen = false;
	let isPrivacyBannerOpen = true;
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

	function clickOutside(element: any, callbackFunction: any) {
		function onClick(event: any) {
			if (!element.contains(event.target)) {
				callbackFunction();
			}
		}

		document.body.addEventListener("click", onClick);

		return {
			update(newCallbackFunction: any) {
				callbackFunction = newCallbackFunction;
			},
			destroy() {
				document.body.removeEventListener("click", onClick);
			},
		};
	}

	let message: string;

	helpMenu.subscribe((val) => {
		isHelpMenuOpen = val;
	});

	function closePrivacyBanner() {
		isPrivacyBannerOpen = false;
	}

	function toggleHelpMenu() {
		helpMenu.set(!isHelpMenuOpen);
	}

	function handleKeyDown(event: { key: string }) {
		if (event.key === "Enter") {
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

<div class="spacin relative min-h-0 min-w-0 bg-chat tracking-[0.74px]">
	{#if isPrivacyBannerOpen}
		<script type="text/javascript">
			const privacy = document.getElementById("PrivacyBanner");
			if (privacy) privacy.style.display = "block";
		</script>
		<div class="bg-chat" id="privacy-banner">
			<div class="border-customGray flex justify-between border-b px-4">
				<div class="flex-1 items-center justify-center text-center">
					<div
						class="text-black/white flex items-center justify-center gap-4 px-4 py-3 text-xs lg:text-base"
					>
						<img
							alt="Ai confidential mode logo"
							src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/padlock.png"
							class="h-[20px] w-[20px] lg:h-[22px] lg:w-[22px]"
						/>

						<p>
							Prompts are end-to-end protected.<br />
							Not even Mithril Security can read or train on them. Learn more
							<a
								href="https://www.mithrilsecurity.io/privacy-policy#new-pp"
								target="_blank"
								rel="noopener noreferrer"
								class="text-tertiary hover:underline">here</a
							>.
						</p>
					</div>
				</div>
				<button
					type="button"
					class="mr-1 pt-4"
					style="align-self: flex-start;"
					on:click={closePrivacyBanner}
				>
					<CarbonClose class="customHover  text-xl text-customBlack" />
				</button>
			</div>
		</div>
	{/if}
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
		class="pointer-events-none absolute inset-x-0 bottom-0 z-0 mx-auto flex w-full max-w-3xl flex-col items-center justify-center border-0 px-3.5 py-2 dark:bg-chat sm:px-5 md:pb-6 md:pt-4 xl:max-w-4xl [&>*]:pointer-events-auto"
	>
		<div class="flex w-full pb-3 max-md:justify-between">
			{#if settings?.searchEnabled}
				<WebSearchToggle />
			{/if}
		</div>
		<form
			on:submit|preventDefault={handleSubmit}
			class="dark:secondary relative flex w-full max-w-4xl flex-1 items-center rounded-xl border border-none bg-secondary focus-within:border-gray-300 dark:focus-within:border-gray-500
			{isReadOnly ? 'opacity-30' : ''}"
		>
			<div class="flex w-full flex-1 border-none bg-transparent py-1">
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
					

			
					<div
						class="mx-1 my-1 hidden h-[2.4rem] items-center p-1 px-[0.7rem] text-gray-400 enabled:hover:text-gray-700 disabled:opacity-60 enabled:dark:hover:text-gray-100 dark:disabled:opacity-40 md:flex"
					>
						<img
							on:keypress={() => dispatch("stop")}
							alt="stop generating img"
							src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/stopInput.png"
							class="h-[24px] w-[24px] hover:cursor-pointer customHover "
							on:click={() => dispatch("stop")}
						/>
					</div>
			
				{:else}
					<button
						class="btn bg-red-20 mx-1 my-1 h-[2.4rem] self-end rounded-lg p-1 px-[0.7rem] enabled:hover:text-gray-700 disabled:opacity-60 enabled:dark:hover:text-gray-100 dark:disabled:opacity-40 {message
							? 'customHover blueImg'
							: ''} "
						disabled={!message || isReadOnly}
						type="submit"
					>
						<img
							alt="send button img"
							src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/send.png"
							class="h-[30px] w-[30px] "
						/>
					</button>
				{/if}
			</div>
		</form>
		<div class="mb-8 mt-2 flex justify-center text-center text-xs lg:mb-0">
			<p>
				Generated content may be inaccurate or false. All conversations are end-to-end protected.
			</p>
		</div>

		{#if messages.length}
			<script type="text/javascript">
				const bannere = document.getElementById("banner");
				if (bannere) bannere.style.display = "block";
			</script>
		{:else}
			<script type="text/javascript">
				const banner = document.getElementById("banner");
				if (banner) banner.style.display = "none";
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
	</div>
</div>

{#if isHelpMenuOpen}
	<script type="text/javascript">
		document.getElementById("helpMenu").style.display = "block";
	</script>
	<div
		use:clickOutside={toggleHelpMenu}
		in:scale
		id="helpMenu"
		class="bottom-[48px] right-[20px] flex items-center justify-center rounded-2xl border-t border-gray-200/50 bg-newPrimary p-2 shadow-xl {isHelpMenuOpen
			? 'open'
			: ''}"
		style="position: absolute;"
	>
		<div>
			<div class="flex-1 items-center justify-center p-2 text-center">
				<a
					href="https://www.mithrilsecurity.io/faq"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:customHover flex items-center rounded-md bg-newPrimary p-2 text-tertiary"
				>
					<img
						class="mr-1 max-h-[20px] max-w-[20px]"
						alt="redirect to page in new tab icon"
						src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/linke.png"
						title="link to open new page"
					/>
					FAQ
				</a>
				<a
					href="https://github.com/mithril-security/blind_chat/issues"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:customHover flex items-center rounded-md bg-newPrimary p-2 text-tertiary"
				>
					<img
						class="mr-1 max-h-[20px] max-w-[20px]"
						alt="redirect to page in new tab icon"
						src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/linke.png"
						title="link to open new page"
					/>
					Report problem
				</a>
				<a
					href="https://www.mithrilsecurity.io/privacy-policy"
					target="_blank"
					rel="noopener noreferrer"
					class="hover:customHover flex items-center rounded-md bg-newPrimary p-2 text-tertiary"
				>
					<img
						class="mr-1 max-h-[20px] max-w-[20px]"
						alt="redirect to page in new tab icon"
						src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/linke.png"
						title="link to open new page"
					/>
					Privacy policy
				</a>
			</div>
		</div>
	</div>
{/if}

<img
	on:click|stopPropagation={toggleHelpMenu}
	on:keydown={handleKeyDown}
	alt="send button img"
	src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/interogationPoint.png"
	class="customHover absolute bottom-3 right-4 h-[28px] w-[28px] blueImg cursor-pointer lg:h-[30px] lg:w-[30px]"
/>
