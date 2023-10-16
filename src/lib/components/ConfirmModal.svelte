<script lang="ts">
	import Modal from "$lib/components/Modal.svelte";
	import { createEventDispatcher } from "svelte";
	import CarbonClose from "~icons/carbon/close";

	const dispatch = createEventDispatcher<{ close: void }>();
</script>

<Modal>
	<div class="flex w-full flex-col gap-0 p-2">
		<div class="m-2 flex items-start text-xl font-bold text-gray-800">
			<h1>You are about to download an AI model on your device</h1>
			<br />
			<button type="button" class="group" on:click={() => dispatch("close")}>
				<CarbonClose class="text-gray-900 group-hover:text-gray-500" />
			</button>
		</div>
		<div class="text-m m-2 flex items-start text-gray-800">
			<br />To ensure your conversations with our AI remain private, our web application sends a
			model to your device to perform inference locally. No data leaves your device.<br />
			<br />This might be demanding in terms of bandwidth, storage and computing power on your side.<br
			/>
			<br />
		</div>
		<div class="text-m m-2 flex items-start text-gray-800">
			<br /><b>Mobile usage is not advised.</b><br />
		</div>
		<br />
	</div>
</Modal>
