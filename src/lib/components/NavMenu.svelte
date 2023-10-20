<script lang="ts">
	import { base } from "$app/paths";
	import { createEventDispatcher } from "svelte";

	import Logo from "$lib/components/icons/Logo.svelte";
	import { switchTheme } from "$lib/switchTheme";
	import { PUBLIC_APP_NAME, PUBLIC_ORIGIN } from "$env/static/public";
	import NavConversationItem from "./NavConversationItem.svelte";
	import type { LayoutData } from "../../routes/$types";
	import { api_key_writable, is_logged_writable, userWritable } from "../../routes/LayoutWritable";

	const dispatch = createEventDispatcher<{
		shareConversation: { id: string; title: string };
		clickSettings: void;
		clickLogout: void;
	}>();

	export let conversations: Array<{
		id: string;
		title: string;
	}> = [];

	export let canLogin: boolean;
	export let signedIn: boolean;
	export let user: LayoutData["user"];

	export let loginModalVisible;

	let isSubMenuOpen: boolean = false;

	function toggleSubMenu() {
		isSubMenuOpen = !isSubMenuOpen;
	}

	async function logoutSubmit(event: { preventDefault: () => void }) {
		event.preventDefault();

		try {
			const response = await fetch("https://cloud.mithrilsecurity.io/api/auth/logout", {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});

			if (response.ok) {
				// Handle a successful response
				console.log("Logout successful");
				signedIn = false;
				is_logged_writable.set(false);
				api_key_writable.set("");
			} else {
				// Handle errors
				console.error("Logout failed");
			}
		} catch (error) {
			// Handle network errors
			console.error("Network error", error);
		}
	}
</script>

<div class="sticky top-0 flex flex-none items-center justify-between px-3 py-3.5 max-sm:pt-0">
	<a class="flex items-center rounded-xl text-lg font-semibold" href="{PUBLIC_ORIGIN}{base}/">
		<Logo classNames="mr-1" />
		{PUBLIC_APP_NAME}
	</a>
	<a
		href={`${base}/`}
		class="flex rounded-lg border bg-white px-2 py-0.5 text-center shadow-sm hover:shadow-none dark:border-gray-600 dark:bg-gray-700"
	>
		New Chat
	</a>
</div>
<div
	class="scrollbar-custom flex flex-col gap-1 overflow-y-auto rounded-r-xl bg-gradient-to-l from-gray-50 px-3 pb-3 pt-2 dark:from-gray-800/30"
>
	{#each conversations as conv (conv.id)}
		<NavConversationItem on:editConversationTitle on:deleteConversation {conv} />
	{/each}
</div>

<!--
	{#if user?.username || user?.email}
		<form
			action="{base}/logout"
			method="post"
			class="group flex items-center gap-1.5 rounded-lg pl-3 pr-2 hover:bg-gray-100 dark:hover:bg-gray-700"
		>
			<span
				class="flex h-9 flex-none shrink items-center gap-1.5 truncate pr-2 text-gray-500 dark:text-gray-400"
				>{user?.username || user?.email}</span
			>
			<button
				type="submit"
				class="ml-auto h-6 flex-none items-center gap-1.5 rounded-md border bg-white px-2 text-gray-700 shadow-sm group-hover:flex hover:shadow-none dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400 dark:hover:text-gray-300 md:hidden"
			>
				Log Out
			</button>
		</form>
	{/if}
	-->

<div class="display position relative inline-block">
	<div
		class="group flex h-11 flex-none items-end gap-1.5 rounded-lg pl-3 pr-2 font-semibold text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
		style="bottom: 90%; justify-content: space-between; border-top: 1px solid white; border-radius:0; margin: 5%"
	>
		{user?.email || "Legolas@lotr.com"}<button
			class="ellipsis-button"
			on:click={toggleSubMenu}
			style="justify:right;">...</button
		>
	</div>
	{#if isSubMenuOpen}
		<script type="text/javascript">
			document.getElementById("submenu").style.display = "block";
		</script>
		<div class="submenu {isSubMenuOpen ? 'open' : ''}" style="position: absolute; bottom: 100%; width: 100%; background-color: #111827;">
			<button
				on:click={() => dispatch("clickSettings")}
				type="button"
				class="group flex h-11 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
				style="width: 100%;"
				>
				Settings
			</button>
			<button
				on:click={logoutSubmit}
				type="button"
				class="group flex h-11 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
				style="width: 100%;"
				>
				Log out
			</button>
		</div>
	{/if}
</div>

<!--
	<div class="menu">
		<div class="relative grow -space-y-px overflow-hidden text-ellipsis whitespace-nowrap text-left text-gray-700 gizmo:-top-px dark:text-white">
		<div class="font-semibold">{user?.name || 'Legolas'}
		</div>
	</div>
	{#if isSubMenuOpen}
		<script type="text/javascript"> document.getElementById("submenu").style.display = "block"; </script>
		<div class="submenu {isSubMenuOpen ? 'open' : ''}">
		<button
		on:click={() => dispatch("clickSettings")}
		type="button"
		class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
		>
			Settings
		</button>
		<button
			on:click={logoutSubmit}
			type="button"
			class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
		>
			Log out
		</div>
	{/if}
</div>

	
	{/if}
	{#if !signedIn}
		<button
			on:click={() => (loginModalVisible = true)}
			type="button"
			class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
		>
			Login
		</button>
	{/if}
	{#if signedIn}
		<button
			on:click={logoutSubmit}
			type="button"
			class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
		>
			Log out
		</button>
	{/if}
	<button
		on:click={switchTheme}
		type="button"
		class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
	>
		Theme
	</button>
	<button
		on:click={() => dispatch("clickSettings")}
		type="button"
		class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
	>
		Settings
	</button>
	<a
		href="https://github.com/mithril-security/blind_chat/issues"
		target="_blank"
		rel="noreferrer"
		class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
	>
		Feedback
	</a>
	<a
		href="https://www.mithrilsecurity.io/faq"
		target="_blank"
		rel="noreferrer"
		class="flex h-9 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700"
	>
		About & Privacy
	</a>
	-->
