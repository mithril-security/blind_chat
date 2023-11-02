<script lang="ts">
	import { browser } from "$app/environment";
	import { base } from "$app/paths";
	import { page } from "$app/stores";
	import { PUBLIC_APP_DATA_SHARING, PUBLIC_APP_NAME, PUBLIC_VERSION } from "$env/static/public";
	import LogoHuggingFaceBorderless from "$lib/components/icons/LogoHuggingFaceBorderless.svelte";
	import Modal from "$lib/components/Modal.svelte";
	import type { LayoutData } from "../../routes/$types";
	import Logo from "./icons/Logo.svelte";
	export let settings: LayoutData["settings"];
	import { createEventDispatcher } from "svelte";
	import { Textfield, Checkbox } from "svelte-mui";
	import CarbonClose from "~icons/carbon/close";

	const isIframe = browser && window.self !== window.parent;

	let email = ""; // The email value
	let success = false;
	let subscribeNewsletter = false; // The subscribeNewsletter value

	const dispatch = createEventDispatcher<{ close: void }>();

	async function handleSubmit(event: { preventDefault: () => void }) {
		event.preventDefault();

		const data = {
			email,
			subscribeNewsletter,
		};

		try {
			const response = await fetch("https://cloud.mithrilsecurity.io/api/auth/blindChatRegister", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify(data),
			});
			dataLayer.push({'event': 'signup-start'});
			if (response.ok) {
				// Handle a successful response
				console.log("Registration successful");
				success = true;
			} else {
				console.log(response);
				// Handle errors
				console.error("Registration failed");
			}
		} catch (error) {
			// Handle network errors
			console.error("Network error", error);
		}
	}

	async function apiSubmit(event: { preventDefault: () => void }) {
		event.preventDefault();

		try {
			const response = await fetch("https://mithrilsecurity.io/api/apiKeys", {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				// Handle a successful response
				console.log(response);
				console.log("Api call successful");
			} else {
				// Handle errors
				console.error("Api call failed");
			}
		} catch (error) {
			// Handle network errors
			console.error("Network error", error);
		}
	}
</script>

<Modal>
	<div
		class="max-w-[400px] flex w-full flex-col items-center gap-6 bg-gradient-to-t from-primary-500/40 via-primary-500/10 to-primary-500/0 px-4 pb-10 pt-9 text-center"
	>
		{#if !success}
			<h2 class="flex items-center text-2xl font-semibold text-gray-800">
				<Logo classNames="mr-1" />
				<div class="text-white">{PUBLIC_APP_NAME}</div>
				<div
					class="ml-3 flex h-6 items-center rounded-lg border border-gray-100 bg-gray-50 px-2 text-base text-gray-400"
				>
					v{PUBLIC_VERSION}
				</div>
				<button type="button" class="group" on:click={() => dispatch("close")}>
					<CarbonClose class="text-gray-900 group-hover:text-gray-500" />
				</button>
			</h2>
			{#if $page.data.requiresLogin}
				<p
					class="px-4 text-lg font-semibold leading-snug text-gray-800 sm:px-12"
					style="text-wrap: balance;"
				>
					Please Sign in with Mithril Security Cloud to continue
				</p>
			{/if}
			<p class="text-base text-gray-800">
				Disclaimer: AI is an area of active research with known problems such as biased generation
				and misinformation. Do not use this application for high-stakes decisions or advice.
			</p>
			<form
				on:submit={handleSubmit}
				target={isIframe ? "_blank" : ""}
				class="flex w-full flex-col items-center gap-2"
			>
				<div>
					<Textfield variant="outlined" type="email" bind:value={email} label="Email" required />
					<Checkbox
						bind:checked={subscribeNewsletter}
						label="Subscribe to Newsletter"
						type="checkbox"
						id="subscribeNewsletter"
					>
						Subscribe to Newsletter
					</Checkbox>
				</div>
				<button
					type="submit"
					class="mt-2 flex items-center whitespace-nowrap rounded-full bg-black px-5 py-2 text-lg font-semibold text-gray-100 transition-colors hover:bg-primary-500"
				>
					Magic link 🪄
				</button>
			</form>
		{:else}
			<p class="flex items-center text-2xl font-semibold text-gray-800" style="text-wrap: balance;">
				Magic link sent to your email address. Please check your inbox.
			</p>
		{/if}
	</div>
</Modal>
