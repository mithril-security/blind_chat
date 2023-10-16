<script lang="ts">
	import Modal from "$lib/components/Modal.svelte";
</script>

<Modal>
	<div class="flex w-full flex-col gap-0 p-2">
		<div class="flex items-start text-xl font-bold text-gray-800">
			<h2>Initializing the model...</h2>
			<br />
		</div>
		<div class="text-s flex items-start text-gray-800">
			<br />The model is preparing the answer for your queries...
		</div>
		<br />
	</div>
</Modal>
