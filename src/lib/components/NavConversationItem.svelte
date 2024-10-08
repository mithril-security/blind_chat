<script lang="ts">
	import { base } from "$app/paths";
	import { page } from "$app/stores";
	import { createEventDispatcher } from "svelte";
	import { params_writable } from "../../routes/conversation/[id]/ParamsWritable";
	import { PUBLIC_APP_ASSETS, PUBLIC_ORIGIN } from "$env/static/public";

	export let conv: { id: string; title: string };

	let confirmDelete = false;
	let doubleClicked = false;
	let inputElement: HTMLElement;

	$: if (inputElement) inputElement.focus();

	const dispatch = createEventDispatcher<{
		deleteConversation: string;
		editConversationTitle: { id: string; title: string };
	}>();
</script>

<div class="cursor-pointer rounded-xl h-[68px]">
	<a
		data-sveltekit-noscroll
		on:click={() => {
			params_writable.set(conv.id);
		}}
		class:hover:bg-[#F1F1F1]={conv.id !==
			$page.params.id}
		href="{base}/conversation/{conv.id}"
		class="group relative flex flex-none h-[68px]  items-center gap-1.5 rounded-xl  px-4 transition-all duration-100 hover:border-tertiary  hover:text-customBlack {conv.id ===
		$page.params.id
			? 'bg-newPrimary text-customBlack'
			: ' text-customGrey bg-secondary'}"
		on:dblclick={() => {
			doubleClicked = true;
		}}
	>
		<!-- styling for current chat goes just after question mark above-->

		<div class="flex-1 truncate">
			{conv.title}
		</div>

		<button
			type="button"
			class="flex items-center justify-center"
			title="Delete conversation"
			on:click|preventDefault={() => {
				confirmDelete = true;
			}}
		>
			<img
				alt="trash icon"
				src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/trash.png"
				class=" trash customHover h-[24px] w-[24px] group-hover:opacity-100 {conv.id === $page.params.id
					? 'opacity-100'
					: 'opacity-40'}"
			/>
		</button>

		<!-- show modify input  -->
		{#if doubleClicked}
			<input
				bind:this={inputElement}
				on:focus|preventDefault
				on:click|preventDefault
				on:blur={() => (doubleClicked = false)}
				class="focus:border-customGray absolute left-0 z-[10000]

				 w-full rounded-xl h-[68px] py-2.5  px-4  text-customBlack outline-none focus:border"
				type="text"
				bind:value={conv.title}
				on:input|preventDefault={(event) => {
					const newTitle = event?.target?.value;
					if (!newTitle) return;
					dispatch("editConversationTitle", { id: conv.id, title: newTitle });
				}}
			/>{/if}
	</a>
</div>

{#if confirmDelete}
	<div
		class="fixed left-0 top-0 z-[100] flex h-full w-full items-center justify-center bg-gray-200/50"
	>
		<div class="flex flex-col gap-2 rounded-2xl bg-secondary p-6 shadow-xl">
			<div class="flex items-center justify-center">
				<div class="rounded-full bg-tertiary bg-opacity-20 p-0.5">
					<img

						class=" blue-filter-img h-[50px] w-[50px]"
						alt="trash icon"
						src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/trash.png"
					/>
				</div>
			</div>
			<div class="my-3.5 flex flex-col gap-2">
				<h2 class="text-center text-2xl font-bold text-customBlack">Delete chat</h2>
				<p class="max-w-[400px] text-center">
					Are you sure you want to delete this conversation? <br /> Action can’t be undone
				</p>
			</div>

			<div class="flex flex-col items-center gap-2">
				<button
					type="button"
					class="flex w-full items-center customHover justify-center rounded-xl bg-red-700 px-2 py-3 text-white sm:w-1/2"
					on:click|preventDefault={() => {
						dispatch("deleteConversation", conv.id);
						doubleClicked = false;
					}}
				>
				Delete conversation
				</button>
				<button
					type="button"
					class="flex w-full items-center customHover justify-center rounded-xl px-2 py-3 text-tertiary sm:w-1/2"
					on:click|preventDefault={() => {
						confirmDelete = false;
					}}
				>
					Cancel
				</button>
			</div>
		</div>
	</div>
{/if}

<style>
	.blue-filter-img {
		filter: invert(22%) sepia(100%) saturate(1000%) hue-rotate(180deg) brightness(100%)
			contrast(100%);
	}

	.trash:hover {
            filter: invert(33%) sepia(100%) saturate(7488%) hue-rotate(1deg) brightness(108%) contrast(131%);
        }
</style>
