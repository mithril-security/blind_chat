<script lang="ts">
	import { base } from "$app/paths";
	import Popup from "../components/Popup.svelte"
	import { createEventDispatcher } from "svelte";
	import Login from "$lib/components/Login.svelte";
	import Logo from "$lib/components/icons/Logo.svelte";
	import { page } from "$app/stores";
	import { PUBLIC_APP_NAME, PUBLIC_ORIGIN, PUBLIC_APP_ASSETS, PUBLIC_DISABLE_LOGIN } from "$env/static/public";
	import NavConversationItem from "./NavConversationItem.svelte";
	import type { LayoutData } from "../../routes/$types";
	import { api_key_writable, is_logged_writable, is_magic_writable, email_addr_writable, first_time_writable} from "../../routes/LayoutWritable";

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
	export let isFirstTime: boolean;
	export let signedIn: boolean;
	export let user: LayoutData["user"];

	export let loginModalVisible;

	let isSubMenuOpen: boolean = false;
	let magic = false;
	let disableLogin = PUBLIC_DISABLE_LOGIN === "true" ? true : false;
	let isLogged = disableLogin ? true : false;

	console.log(disableLogin)

	is_magic_writable.subscribe((val) => {
		magic = val;
	})

	is_logged_writable.subscribe((val) => {
		isLogged = val;
	})

	first_time_writable.subscribe((val) => {
		isFirstTime = val;
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
<!-- {#if disableLogin == false || !$is_logged_writable}
    <Login/>
{/if} -->
{#if isFirstTime == true}
	<Popup/>
{/if}

<!-- top left corner - remove from class bg-[#141c2a] -->
<div class="bg-[#142343] sticky top-0 flex flex-none items-center justify-between px-3 py-5 max-sm:pt-0">
	<a class="flex items-center rounded-xl text-lg font-semibold" href="{PUBLIC_ORIGIN}{base}/">
		<Logo classNames="mr-1" />
		<div class = "pl-2 text-white"> {PUBLIC_APP_NAME} </div>
	</a>
	<a
		href={`${base}/`}
		class="flex rounded-lg border bg-white px-2 py-0.5 text-center shadow-sm hover:shadow-none dark:border-mithril-border dark:bg-sidebar"
	>
		New Chat
	</a>
</div>
<!-- left side bar 
style = "background-color: #141c2a !important;"
-->
<div
	class="bg-[#142343] scrollbar-custom flex flex-col gap-1 overflow-y-auto px-3 pb-3 pt-2 dark:from-gray-800/30"
	
>
	{#each conversations as conv (conv.id)}
		<div class="py-1">
		<NavConversationItem on:editConversationTitle on:deleteConversation {conv}/>
		</div>
	{/each}
</div>

<div class="display position relative inline-block bg-[#142343] flex justify-center items-center pb-4">
	{#if !disableLogin}
	<div
    class="rounded-2xl text-center bg-[#0d1830] flex items-center justify-center group h-11 -lg text-white w-[96%] hover:bg-gray-600 font-semibold"
    on:click={toggleSubMenu}
    on:keydown={handleKeyDown}
>
    {email_addr.length > 0 ? email_addr.substring(0, 20) : "Not logged in"}
</div>
{:else}
<div
	class="hover:bg-gradient-to-r from-[#1485e6] to-[#01F8FF] p-0.2 rounded-2xl text-center bg-[#0d1830] flex items-center justify-center group h-11 -lg text-white w-[96%] font-semibold">
	<a href="https://1qdag6eehid.typeform.com/to/EFrGfL1u" target="_blank" rel="noopener noreferrer" 
	class="bg-[#0d1830] px-8 block py-2 text-center text-white rounded-2xl w-[99%]">
		Give Feedback
	</a>
</div>
{/if}

{#if isSubMenuOpen}
<script type="text/javascript">
	document.getElementById("submenu").style.display = "block";
</script>
<div class="justify-center items-center rounded-2xl {isSubMenuOpen ? 'open' : ''}" style="position: absolute; bottom: 100%; width: 96%; background-color: #0d1830 !important;">
	<div>
		<div class="flex justify-center" style="position: relative;">
		<a href="https://1qdag6eehid.typeform.com/to/EFrGfL1u" target="_blank" rel="noopener noreferrer" 
		class="px-8 block py-3 text-center h-11 text-white rounded-2xl w-[100%]">
			Give Feedback
		</a>
		<img
			class="absolute max-w-[3%] md:max-w-[6%] bottom-[32%] right-[35%] md:right-[20%]"
			alt="redirect to page in new tab icon"
			src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/link.png"
			title="link to open new page"
		   />
	</div>
		<div class="justify flex items-center justify-center">
		<p class="border-t border-mithril-border w-[80%]"></p>
		</div>
		<button
			on:click={logoutSubmit}
			type="button"
			class="px-8 py-3 text-center h-11 text-white hover:bg-gray-600 rounded-2xl" 
			style="width: 100%;"
		>
			<p class="">Log out</p>
		</button>
	</div>
</div>
{/if}
</div>