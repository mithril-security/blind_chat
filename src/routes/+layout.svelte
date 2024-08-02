<script lang="ts">
	import { onDestroy, onMount } from "svelte";
	import { goto, invalidate } from "$app/navigation";
	import { page } from "$app/stores";
	import { browser } from "$app/environment";
	import "../styles/main.css";
	import { base } from "$app/paths";
	import {
		PUBLIC_ORIGIN,
		PUBLIC_APP_DISCLAIMER,
		PUBLIC_SHOW_LOCAL_MODELS_WARNING,
		PUBLIC_DISABLE_LOGIN,
		PUBLIC_API_KEY,
	} from "$env/static/public";

	import { shareConversation } from "$lib/shareConversation";
	import { UrlDependency } from "$lib/types/UrlDependency";
	import { error } from "$lib/stores/errors";

	import MobileNav from "$lib/components/MobileNav.svelte";
	import NavMenu from "$lib/components/NavMenu.svelte";
	import Toast from "$lib/components/Toast.svelte";
	import ConfirmModal from "$lib/components/ConfirmModal.svelte";
	import ShouldLoginModal from "$lib/components/ShouldLoginModal.svelte";
	import SettingsModal from "$lib/components/SettingsModal2.svelte";
	import LoadingModal from "$lib/components/LoadingModal.svelte";
	import LoginModal from "$lib/components/LoginModal.svelte";
	import { PUBLIC_APP_ASSETS, PUBLIC_APP_NAME } from "$env/static/public";
	import {
		isloading_writable,
		is_init_writable,
		refresh_chats_writable,
		refresh_chats_writable_empty,
		api_key_writable,
		is_logged_writable,
		showLoggedPopup_writable,
		is_magic_writable,
		email_addr_writable
	} from "./LayoutWritable";
	import {
		deleteAllChats,
		deleteChat,
		getChats,
		getMessages,
		modifyTitle,
	} from "../routes/LocalDB";
	import { env } from "$env/dynamic/public";
	import InitModelModal from "$lib/components/InitModelModal.svelte";
	import { getApiKey } from "./tools";

	export let data;
	let isloading = false;
	let isInit = false;
	let disableLogin = PUBLIC_DISABLE_LOGIN === "true" ? true : false;
	let showWarning = PUBLIC_SHOW_LOCAL_MODELS_WARNING === "true" ? true : false;
	let shouldLogin = false;

	let go_to_main = false;

	let conversations_list = [];

	showLoggedPopup_writable.subscribe((value) => {
		shouldLogin = disableLogin ? false : value;
	});

	is_init_writable.subscribe((value) => {
		isInit = value;
	});

	isloading_writable.subscribe((value) => {
		isloading = value;
	});

	let isNavOpen = false;
	let isSettingsOpen = false;
	let errorToastTimeout: ReturnType<typeof setTimeout>;
	let currentError: string | null;

	refresh_chats_writable.subscribe(async (value) => {
		if (value.length > 0) {
			conversations_list = value;
			refresh_chats_writable.set([]);
		}
	});

	refresh_chats_writable_empty.subscribe(async (value) => {
		conversations_list = [];
		refresh_chats_writable.set(conversations_list);
	});

	export function getProgress(progress: number) {}

	async function onError() {
		// If a new different error comes, wait for the current error to hide first
		if ($error && currentError && $error !== currentError) {
			clearTimeout(errorToastTimeout);
			currentError = null;
			await new Promise((resolve) => setTimeout(resolve, 300));
		}

		currentError = $error;

		errorToastTimeout = setTimeout(() => {
			$error = null;
			currentError = null;
		}, 3000);
	}

	async function deleteConversation(id: string) {
	 await deleteChat(id);

		if ($page.params.id !== id) {
			await invalidate(UrlDependency.ConversationList);
		} else {
			await goto(`${base}/`, { invalidateAll: true });
		}
	}

	async function deleteAllConversations(id: string) {
		await deleteAllChats();

		if ($page.params.id !== id) {
			await invalidate(UrlDependency.ConversationList);
		} else {
			await goto(`${base}/`, { invalidateAll: true });
		}
	}

	async function editConversationTitle(id: string, title: string) {
		await modifyTitle(id, title);
	}

	onMount(async () => {
		localStorage.theme = "dark";
		await refreshChats();
	});

	onDestroy(() => {
		clearTimeout(errorToastTimeout);
	});

	$: if ($error) onError();

	data.requiresLogin = true; //
	const requiresLogin =
		!$page.error &&
		!$page.route.id?.startsWith("/r/") &&
		(data.requiresLogin
			? !data.user
			: !data.settings.ethicsModalAcceptedAt && !!PUBLIC_APP_DISCLAIMER);

	let loginModalVisible = false;

	async function refreshChats() {
		let ret = await getChats();
		data.conversations = ret;
		conversations_list = ret;
	}
	$: title = env.PUBLIC_APP_NAME;
	let loggedIn = false;
	async function isLogged() {
		if (disableLogin) {
			email_addr_writable.set("BlindChat")
			loggedIn = true;
			is_logged_writable.set(true);
			is_magic_writable.set(true);
			api_key_writable.set(PUBLIC_API_KEY);
		}
		else {
			try {
			const response = await fetch("https://cloud.mithrilsecurity.io/api/auth/getUserInfo", {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			try {
				dataLayer.push({'event': 'login'});
			}
			catch (err) {
				console.error(err);
			}
			if (response.ok) {
				const res = await response.text()
				const json: JSON = JSON.parse(res)
				email_addr_writable.set(json.email)
				console.log(res)
				// Handle a successful response here
				console.log("User is logged in successfully");
				var apiKey = await getApiKey();
				loggedIn = true;
				is_logged_writable.set(loggedIn);
				api_key_writable.set(apiKey);
				is_magic_writable.set(true);
			} 
			else {
				// Handle errors here
				console.error("User is not logged in");
			}
		} catch (err) {
			// Handle network errors here
			console.error("Network error", err);

		}
		is_magic_writable.set(true);
		}
	}
	isLogged();
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME}</title>
	<meta name="og:description" content="Private Conversational AI" />
	<meta property="og:title" content={PUBLIC_APP_NAME} />
	<meta property="og:type" content="website" />
	<meta name="twitter:image" content="https://chat.mithrilsecurity.io/{PUBLIC_APP_ASSETS}/thumbnail.jpg?24"
	/>
	<meta property="og:url" content="{PUBLIC_ORIGIN || $page.url.origin}{base}" />
	<meta
		property="og:image"
		content="https://chat.mithrilsecurity.io/{PUBLIC_APP_ASSETS}/thumbnail.jpg"
	/>
	<link
		rel="icon"
		href="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/favicon.png"
		type="image/png"
	/>
	<!-- Icon Support for iOS Bookmark Home Screen -->
	<link
		rel="apple-touch-icon"
		href="https://chat.mithrilsecurity.io/{PUBLIC_APP_ASSETS}/touch-icon-ipad-retina.png"
		sizes="167x167"
		type="image/png"
	/>
	<link
		rel="apple-touch-icon"
		href="https://chat.mithrilsecurity.io/{PUBLIC_APP_ASSETS}/touch-icon-ipad.png"
		sizes="152x152"
		type="image/png"
	/>
	<link
		rel="apple-touch-icon"
		href="https://chat.mithrilsecurity.io/{PUBLIC_APP_ASSETS}/touch-icon-iphone-retina.png"
		sizes="180x180"
		type="image/png"
	/>
</svelte:head>

<div
	class="grid h-full w-screen grid-cols-1 grid-rows-[auto,1fr] overflow-hidden text-smd dark:text-  md:grid-cols-[320px,1fr]  lg:grid-cols-[368px,1fr] xl:grid-cols-[400px,1fr]  md:grid-rows-[1fr] "
>
	<MobileNav
		isOpen={isNavOpen}
		on:toggle={(ev) => (isNavOpen = ev.detail)}
		title={conversations_list.find((conv) => conv.id === $page.params.id)?.title}
	>
		<NavMenu
			conversations={conversations_list}
			user={data.user}
			canLogin={data.user === undefined && data.requiresLogin}
			signedIn={loggedIn}
			bind:loginModalVisible
			on:shareConversation={(ev) => shareConversation(ev.detail.id, ev.detail.title)}
			on:deleteConversation={(ev) => deleteConversation(ev.detail)}
			on:clickSettings={() => (isSettingsOpen = true)}
			on:editConversationTitle={(ev) => editConversationTitle(ev.detail.id, ev.detail.title)}
		/>
	</MobileNav>
	<nav class="grid max-h-screen grid-cols-1 grid-rows-[auto,1fr,auto] max-md:hidden md:w-[320px] lg:w-[368px] xl:w-[400px]">
		<NavMenu
			conversations={conversations_list}
			user={data.user}
			canLogin={data.user === undefined && data.requiresLogin}
			signedIn={loggedIn}
			bind:loginModalVisible
			on:shareConversation={(ev) => shareConversation(ev.detail.id, ev.detail.title)}
			on:deleteConversation={(ev) => deleteConversation(ev.detail)}
			on:clickSettings={() => (isSettingsOpen = true)}
			on:editConversationTitle={(ev) => editConversationTitle(ev.detail.id, ev.detail.title)}
		/>
	</nav>
	{#if currentError}
		<Toast message={currentError} />
	{/if}
	{#if shouldLogin}
		<ShouldLoginModal on:close={() => showLoggedPopup_writable.set(false)} />
	{/if}
	{#if showWarning}
		<ConfirmModal on:close={() => (showWarning = false)} />
	{/if}
	{#if isInit}
		<InitModelModal />
	{/if}
	{#if isloading}
		<LoadingModal />
	{/if}
	{#if isSettingsOpen}
		<SettingsModal
			on:close={() => (isSettingsOpen = false)}
			on:deleteAllConversations={() => ((isSettingsOpen = false), deleteAllChats())}
			settings={data.settings}
			models={data.models}
		/>
	{/if}
	<!-- {#if (requiresLogin && data.messagesBeforeLogin === 0) || loginModalVisible} -->
	<slot />
</div>
