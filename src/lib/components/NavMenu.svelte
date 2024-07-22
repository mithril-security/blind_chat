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

	let isSubMenuOpen = false;
	let magic = false;
	let disableLogin = PUBLIC_DISABLE_LOGIN === "true" ? true : false;
	let isLogged = disableLogin ? true : false;



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
<div class="bg-secondary sticky top-0 flex flex-none items-center justify-between px-6 pt-6 pb-8 max-sm:pt-0">
	<a class="flex items-center rounded-xl text-xl font-semibold" href="{PUBLIC_ORIGIN}{base}/">
		<Logo classNames="mr-1 h-[36px] w-[42px]" />
		<div class = "pl-1 text-customBlack"> {PUBLIC_APP_NAME} </div>
	</a>

	
	<a
	class='customHover'
		href={`${base}/`}
	>
	<img
			class="w-8 h-8 blueImg"
			alt="redirect to page in new tab icon"
			src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/newChat.png"
			title="link to open new page"
		   />
	</a>
</div>
<!-- left side bar 
style = "background-color: #141c2a !important;"
-->
<div
	class="bg-secondary scrollbar-custom flex flex-col gap-1 overflow-y-auto px-6 pb-3  dark:from-gray-800/30"
	
>	
	{#each conversations as conv (conv.id)}
		<div class="py-1">
		<NavConversationItem on:editConversationTitle on:deleteConversation {conv}/>
		</div>
	{/each}
</div>

<div class="display position relative  bg-secondary flex justify-center items-center pb-4">
	{#if !disableLogin}
	<div
    class="rounded-2xl text-center bg-newPrimary flex items-center justify-center group h-11 -lg text-customBlack w-[96%] hover:bg-gray-600 font-semibold"
    on:click={toggleSubMenu}
    on:keydown={handleKeyDown}
>
    {email_addr.length > 0 ? email_addr.substring(0, 20) : "Not logged in"}
</div>
{:else}
<div class="flex flex-col gap-4 w-full items-center px-6">

<div
	class="border customHover border-tertiary  active:scale-95 transition-all duration-100  rounded-xl text-center bg-newPrimary flex items-center justify-center group h-[62px]   w-[96%] font-semibold">
	<a href="https://github.com/mithril-security/blind_llama_client/blob/main/docs/docs/whitepaper/blind_llama_whitepaper.pdf" target="_blank" rel="noopener noreferrer" 
	class="bg-newPrimary py-2 text-center  block text-tertiary rounded-xl w-[99%]">
	<div class="flex items-center w-full justify-center gap-1 text-lg"><img
		class="w-8 h-8 transform translate-y-[-1.5px]"
		alt="shield"
		src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/shield.png"

	   />Security manifest</div>
	
	</a>
</div>
<div
	class=" customHover  active:scale-95   transition-all duration-100  rounded-xl text-center bg-newPrimary flex items-center justify-center group h-[62px]    text-customBlack w-[96%] font-semibold">
	<a href="https://blindllama.mithrilsecurity.io/en/latest/docs/getting-started/how-we-achieve-zero-trust/" target="_blank" rel="noopener noreferrer" 
	class="bg-newPrimary  block py-2 text-center text-customBlack  rounded-xl w-[99%] text-lg">
	How BlindChat works
	</a>
</div>
<div
	class=" customHover mb-4   active:scale-95  transition-all duration-100  rounded-xl text-center bg-newPrimary flex items-center justify-center group h-[62px]    text-customBlack w-[96%] font-semibold">
	<a href="https://1qdag6eehid.typeform.com/to/EFrGfL1u" target="_blank" rel="noopener noreferrer" 
	class="bg-newPrimary  block py-2 text-center text-customBlack  rounded-xl w-[99%] text-lg">
		Give Feedback
	</a>
</div>
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
		class="px-8 block py-3 text-center h-11 text-customBlack rounded-2xl w-[100%]">
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
			class="px-8 py-3 text-center h-11 text-customBlack hover:bg-gray-600 rounded-2xl" 
			style="width: 100%;"
		>
			<p class="">Log out</p>
		</button>
	</div>
</div>
{/if}
</div>