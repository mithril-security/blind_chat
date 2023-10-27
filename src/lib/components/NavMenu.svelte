<script lang="ts">
	import { base } from "$app/paths";
	import { createEventDispatcher } from "svelte";
	import Login from "$lib/components/Login.svelte";
	import Logo from "$lib/components/icons/Logo.svelte";
	import { switchTheme } from "$lib/switchTheme";
	import { PUBLIC_APP_NAME, PUBLIC_ORIGIN } from "$env/static/public";
	import NavConversationItem from "./NavConversationItem.svelte";
	import PleaseWaitModal from "./PleaseWaitModal.svelte";
	import type { LayoutData } from "../../routes/$types";
	import { api_key_writable, is_logged_writable, is_magic_writable, email_addr_writable } from "../../routes/LayoutWritable";
	import LoginModal from "./LoginModal.svelte";

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
	let magic = false;
	let isLogged = false;

	is_magic_writable.subscribe((val) => {
		magic = val;
	})

	is_logged_writable.subscribe((val) => {
		isLogged = val;
	})

	let email_addr = ""

	email_addr_writable.subscribe((val) => {
		email_addr = val
	})

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
				email_addr_writable.set("");
			} else {
				// Handle errors
				console.error("Logout failed");
			}
		} catch (error) {
			// Handle network errors
			console.error("Network error", error);
		}
	}

	function handleKeyDown(event: { key: string; }) {
    if (event.key === 'Enter') {
      toggleSubMenu();
    }
  }

	function handleTempClick() {
        loginModalVisible = true;
        is_magic_writable.set(false);
    }
</script>
{#if !$is_logged_writable}
    <Login/>
{/if}
<!-- top left corner -->
<div class="bg-[#141c2a] sticky top-0 flex flex-none items-center justify-between px-3 py-5 max-sm:pt-0 border-r border-r-[#1E9FE7]">
	<a class="flex items-center rounded-xl text-lg font-semibold" href="{PUBLIC_ORIGIN}{base}/">
		<Logo classNames="mr-1" />
		<div class = "pl-2"> {PUBLIC_APP_NAME} </div>
	</a>
	<a
		href={`${base}/`}
		class="flex rounded-lg border bg-white px-2 py-0.5 text-center shadow-sm hover:shadow-none dark:border-mithril-border dark:bg-sidebar"
	>
		New Chat
	</a>
</div>
<!-- left side bar -->
<div
	class="border-r border-r-[#1E9FE7] scrollbar-custom flex flex-col gap-1 overflow-y-auto px-3 pb-3 pt-2 dark:from-gray-800/30"
	style = "background-color: #141c2a !important;"
>
	{#each conversations as conv (conv.id)}
		<NavConversationItem on:editConversationTitle on:deleteConversation {conv} />
	{/each}
</div>
<div class="display position relative inline-block">
	<div
    class="border-r border-r-[#1E9FE7] text-center bg-[#1a2133] flex items-center justify-center group h-11 -lg text-white hover:bg-gray-600"
    on:click={toggleSubMenu}
    on:keydown={handleKeyDown}
>
    {email_addr.length > 0 ? email_addr : "Not logged in"}
</div>

{#if isSubMenuOpen}
<script type="text/javascript">
	document.getElementById("submenu").style.display = "block";
</script>
<div class="justify-center items-center rounded-2xl {isSubMenuOpen ? 'open' : ''}" style="position: absolute; bottom: 100%; width: 99%;">
	<div>
		<button
			on:click={() => dispatch("clickSettings")}
			type="button"
			class="px-8 block py-3 text-center h-11 text-white hover:bg-gray-600" style="width: 100%;"
		>
			Settings
		</button>
		<a href="https://1qdag6eehid.typeform.com/to/EFrGfL1u" target="_blank" rel="noopener noreferrer" 
		class="px-8 block py-3 text-center h-11 text-white hover:bg-gray-600" 
		style="width: 100%;">
			Give Feedback
		</a>
		<button
			on:click={logoutSubmit}
			type="button"
			class="px-8 block py-3 text-center h-11 text-white hover:bg-gray-600" 
			style="width: 100%;"
		>
			Log out
		</button>
	</div>
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
-->

<!--
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
