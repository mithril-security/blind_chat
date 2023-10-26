<script lang="ts">
	import Modal from "$lib/components/Modal.svelte";
	import { createEventDispatcher } from "svelte";
	import CarbonClose from "~icons/carbon/close";

	const dispatch = createEventDispatcher<{ close: void }>();
</script>

<Modal>
	<div class="flex w-full flex-col gap-0 p-2">
		<div class="m-2 flex items-start text-xl font-bold text-gray-800">
			<h1>Please wait...</h1>
			<br />
		</div>
		<br />
	</div>
</Modal>
