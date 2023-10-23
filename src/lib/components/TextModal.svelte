<script lang="ts">
	import Modal from "$lib/components/Modal.svelte";
	import { createEventDispatcher } from "svelte";
	import CarbonClose from "~icons/carbon/close";

	export let text="";
	export let title="";
	const dispatch = createEventDispatcher<{ close: void }>();
</script>

<Modal>
	<div class="border border-gray flex w-full flex-col gap-0 p-2 dark:bg-darkBackground dark:text-white" style="border-radius: 0; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
}">
		<div class="dark:text-white m-2 flex items-start text-xl font-bold text-gray-800" style="justify-content: space-between;">
			<h1 class="dark:text-white">{title}</h1>
			<br />
			<button type="button" class="group" on:click={() => dispatch("close")}>
				<CarbonClose class="dark:text-white text-gray-900 group-hover:text-gray-500" />
			</button>
		</div>
		<div class="dark:text-white text-m m-2 flex items-start text-gray-800">
			<br/>{text}
		</div>
	</div>
</Modal>
