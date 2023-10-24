<script lang="ts">
	import Modal from "$lib/components/straightModal.svelte";
	import { createEventDispatcher } from "svelte";
	import CarbonClose from "~icons/carbon/close";

	export let text="";
	export let title="";
	const dispatch = createEventDispatcher<{ close: void }>();
</script>

<Modal>
	<div class="dark:bg-darkBackground border border-gray-600 p-2">
		<div class="dark:text-white m-2 flex items-start text-xl font-bold text-gray-800" style="justify-content: space-between;">
			<h2>{title}</h2>
			<br />
			<button type="button" class="group" on:click={() => dispatch("close")}>
				<CarbonClose class="dark:text-white text-gray-900 group-hover:text-gray-500" />
			</button>
		</div>
		<div class="dark:text-gray-400 text-m m-2 text-gray-800">
			<br/>{text}
		</div>
	</div>
</Modal>
