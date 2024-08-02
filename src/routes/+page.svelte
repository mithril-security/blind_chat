<script lang="ts">
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
	import { PUBLIC_APP_NAME } from "$env/static/public";
	import ChatWindow from "$lib/components/chat/ChatWindow.svelte";
	import { ERROR_MESSAGES, error } from "$lib/stores/errors";
	import { pendingMessage } from "$lib/stores/pendingMessage";
	import { findCurrentModel } from "$lib/utils/models";
	import { params_writable } from "../routes/conversation/[id]/ParamsWritable";
	import {
		curr_model_writable,
		curr_model_writable_string,
		is_logged_writable,
		showLoggedPopup_writable,
		api_key_writable,
	} from "./LayoutWritable";

	let curr_model_id = 0;
	let curr_model;
	let api_key = "";

	export let data;

	let loading = false;
	let isLogged = false;

	is_logged_writable.subscribe((val) => {
		isLogged = val;
	});

	api_key_writable.subscribe((val) => {
		api_key = val;
	});

	curr_model_writable.subscribe((val) => {
		curr_model_id = val;
		curr_model = findCurrentModel(
			[...data.models, ...data.oldModels],
			data.models[curr_model_id].name
		);
		console.log(curr_model);
	});

	// dec2hex :: Integer -> String
	// i.e. 0-255 -> '00'-'ff'
	function dec2hex(dec) {
		return dec.toString(16).padStart(2, "0");
	}

	// generateId :: Integer -> String
	function generateId(len) {
		var arr = new Uint8Array((len || 40) / 2);
		window.crypto.getRandomValues(arr);
		return Array.from(arr, dec2hex).join("");
	}

	async function createConversation(message: string) {
		try {
			const is_local = curr_model.is_local ?? true;
			if (!is_local) {
				if (!isLogged) {
					showLoggedPopup_writable.set(true);
					return;
				}
			}

			loading = true;

			const conversationId = generateId(16);

			// Ugly hack to use a store as temp storage, feel free to improve ^^
			pendingMessage.set(message);
			params_writable.set(conversationId);
			// invalidateAll to update list of conversations
			await goto(`${base}/conversation/${conversationId}`, { invalidateAll: true });
		} catch (err) {
			error.set(ERROR_MESSAGES.default);
			console.error(err);
		} finally {
			loading = false;
		}
	}
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME}</title>
</svelte:head>

<ChatWindow
	on:message={(ev) => createConversation(ev.detail)}
	{loading}
	currentModel={findCurrentModel(
		[...data.models, ...data.oldModels],
		data.models[curr_model_id].name
	)}
	models={data.models}
	settings={data.settings}
/>
