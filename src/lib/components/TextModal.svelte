<script lang="ts">
	import Modal from "$lib/components/Modal.svelte";
	import { createEventDispatcher } from "svelte";
	import CarbonClose from "~icons/carbon/close";

	export let text="";
	export let title="";
	const dispatch = createEventDispatcher<{ close: void }>();
</script>

<Modal>
	<div class="border rounded-2xl border-mithril-border p-2 bg-login text-white">
		<div class = "flex justify-end">
		  <button type="button" class="justify-end" on:click={() => dispatch("close")}>
			<CarbonClose class="justify-end dark:text-white text-gray-900 group-hover:text-gray-500" />
		  </button>
	  </div>
	  <div class="pb-6 dark:text-gray-400 m-2 text-gray-800 text-center" style="display: flex; flex-direction: column; align-items: center;">
		<div class="pb-4 dark:text-mithril-yellow m-2 flex items-center justify-between text-2xl font-bold text-gray-800">
			<h1>{title}</h1>
		</div>
		<div class="text-m">
		{text}
	</div>
	  </div>
	</div>
  </Modal>  
  
