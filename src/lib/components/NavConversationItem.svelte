<script lang="ts">
	import { base } from "$app/paths";
	import { page } from "$app/stores";
	import { createEventDispatcher } from "svelte";
	import { params_writable } from "../../routes/conversation/[id]/ParamsWritable";

	import CarbonCheckmark from "~icons/carbon/checkmark";
	import CarbonTrashCan from "~icons/carbon/trash-can";
	import CarbonClose from "~icons/carbon/close";
	import CarbonEdit from "~icons/carbon/edit";

	export let conv: { id: string; title: string };

	let confirmDelete = false;

	const dispatch = createEventDispatcher<{
		deleteConversation: string;
		editConversationTitle: { id: string; title: string };
	}>();
</script>

<div class="hover:bg-gradient-to-r from-[#1485e6] to-[#01F8FF] p-0.5 rounded-2xl">
<a
	data-sveltekit-noscroll
	on:mouseleave={() => {
		confirmDelete = false;
	}}
	on:click={() => {
		params_writable.set(conv.id);
	}}
	href="{base}/conversation/{conv.id}"
	class="bg-[#142343] group flex h-11 flex-none items-center gap-1.5 pl-3 pr-2 rounded-2xl {conv.id ===
	$page.params.id
		? 'border border-[#1E9FE7] text-white'
		: 'border border-[#0F4A81] text-[#B4B4B4]'}"
>
<!-- styling for current chat goes just after question mark above-->

	<div class="flex-1 truncate">
		{#if confirmDelete}
			<span class="font-semibold"> Delete </span>
		{/if}
		{conv.title}
	</div>

	{#if confirmDelete}
		<button
			type="button"
			class="flex h-5 w-5 items-center justify-center rounded-2xl md:hidden md:group-hover:flex"
			title="Confirm delete action"
			on:click|preventDefault={() => dispatch("deleteConversation", conv.id)}
		>
			<CarbonCheckmark class="text-xs text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" />
		</button>
		<button
			type="button"
			class="flex h-5 w-5 items-center justify-center rounded-2xl md:hidden md:group-hover:flex"
			title="Cancel delete action"
			on:click|preventDefault={() => {
				confirmDelete = false;
			}}
		>
			<CarbonClose class="text-xs text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" />
		</button>
	{:else}
		<button
			type="button"
			class="flex h-5 w-5 items-center justify-center rounded-2xl md:hidden md:group-hover:flex"
			title="Edit conversation title"
			on:click|preventDefault={() => {
				const newTitle = prompt("Edit this conversation title:", conv.title);
				if (!newTitle) return;
				dispatch("editConversationTitle", { id: conv.id, title: newTitle });
			}}
		>
			<CarbonEdit class="text-xs text-gray-400 hover:text-gray-500 dark:hover:text-gray-300" />
		</button>

		<button
			type="button"
			class="flex h-5 w-5 items-center justify-center rounded-2xl md:hidden md:group-hover:flex"
			title="Delete conversation"
			on:click|preventDefault={(event) => {
				if (event.shiftKey) {
					dispatch("deleteConversation", conv.id);
				} else {
					confirmDelete = true;
				}
			}}
		>
			<CarbonTrashCan class="text-xs text-gray-400  hover:text-gray-500 dark:hover:text-gray-300" />
		</button>
	{/if}
</a>
</div>


