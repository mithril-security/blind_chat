<script lang="ts">
	import Modal from "$lib/components/Modal.svelte";
	import { progress_writable, curr_model_writable, map_writable } from "./LoadingModalWritable.js";

	const forceUpdate = async (_) => {};

	let loadingMap = new Map<string, number>();
	let pr = 1;

	map_writable.subscribe((value) => {
		const [model, percent] = value;
		pr = Number(percent);
		if (model.startsWith("onnx")) {
			loadingMap.set(model, Math.floor(Number(percent)));
		}
	});
</script>

<Modal>
	<div class="flex w-full flex-col gap-0 p-2">
		<div class="flex items-start text-xl font-bold text-gray-800">
			<h2>Loading the model...</h2>
			<br />
		</div>
		<div class="text-s flex items-start text-gray-800">
			<br />Please wait while we download the model. This has to be done only once.
		</div>
		<br />
		{#await forceUpdate(pr) then _}
			{#each [...loadingMap] as [key, value]}
				<p class="text-s text-gray-800">{key}</p>
				<div class="w3-light-grey">
					<div class="w3-blue" style="width:{value}%">{value}%</div>
				</div>
				<br />
			{/each}
		{/await}
	</div>
</Modal>
