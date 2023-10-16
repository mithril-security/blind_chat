<script lang="ts">
	import { createEventDispatcher } from "svelte";

	import Modal from "$lib/components/Modal.svelte";
	import CarbonClose from "~icons/carbon/close";
	import Switch from "$lib/components/Switch.svelte";
	import { enhance } from "$app/forms";
	import { base } from "$app/paths";
	import type { Model } from "$lib/types/Model";
	import type { LayoutData } from "../../routes/$types";

	export let settings: LayoutData["settings"];
	export let models: Array<Model>;

	let isConfirmingDeletion = false;

	const dispatch = createEventDispatcher<{ close: void; deleteAllConversations: void }>();
</script>

<Modal on:close>
	<div class="flex w-full flex-col gap-5 p-6">
		<div class="flex items-start justify-between text-xl font-semibold text-gray-800">
			<h2>Settings</h2>
			<button type="button" class="group" on:click={() => dispatch("close")}>
				<CarbonClose class="text-gray-900 group-hover:text-gray-500" />
			</button>
		</div>
		<form
			class="flex flex-col gap-5"
			use:enhance={() => {
				dispatch("close");
			}}
			method="post"
			action="{base}/settings"
		>
			<form on:submit|preventDefault={() => (isConfirmingDeletion = true)}>
				<button type="submit" class="underline decoration-gray-300 hover:decoration-gray-700">
					Delete all conversations
				</button>
			</form>
			<button
				type="submit"
				class="mt-2 rounded-full bg-black px-5 py-2 text-lg font-semibold text-gray-100 ring-gray-400 ring-offset-1 transition-all hover:ring focus-visible:outline-none focus-visible:ring"
			>
				Apply
			</button>
		</form>

		{#if isConfirmingDeletion}
			<Modal on:close={() => (isConfirmingDeletion = false)}>
				<form class="flex w-full flex-col gap-5 p-6">
					<div class="flex items-start justify-between text-xl font-semibold text-gray-800">
						<h2>Are you sure?</h2>
						<button type="button" class="group" on:click={() => (isConfirmingDeletion = false)}>
							<CarbonClose class="text-gray-900 group-hover:text-gray-500" />
						</button>
					</div>
					<p class="text-gray-800">
						This action will delete all your conversations. This cannot be undone.
					</p>
					<button
						type="button"
						class="mt-2 rounded-full bg-red-700 px-5 py-2 text-lg font-semibold text-gray-100 ring-gray-400 ring-offset-1 transition-all hover:ring focus-visible:outline-none focus-visible:ring"
						on:click={() => dispatch("deleteAllConversations")}
					>
						Confirm deletion
					</button>
				</form>
			</Modal>
		{/if}
	</div>
</Modal>
