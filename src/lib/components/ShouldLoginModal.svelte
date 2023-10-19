<script lang="ts">
	import Modal from "$lib/components/Modal.svelte";
	import { createEventDispatcher } from "svelte";
	import CarbonClose from "~icons/carbon/close";

	const dispatch = createEventDispatcher<{ close: void }>();
</script>

<Modal>
	<div class="flex w-full flex-col gap-0 p-2">
		<div class="m-2 flex items-start text-xl font-bold text-gray-800">
			<h1>You need to be logged in before using this model.</h1>
			<br />
			<button type="button" class="group" on:click={() => dispatch("close")}>
				<CarbonClose class="text-gray-900 group-hover:text-gray-500" />
			</button>
		</div>
		<div class="text-m m-2 flex items-start text-gray-800">
			<br />This model is hosted on a secured enclave. Please login and try again to send your
			request.<br />
		</div>
		<br />
	</div>
</Modal>
