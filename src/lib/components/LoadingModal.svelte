<script lang="ts">
	import Modal from "$lib/components/Modal.svelte";
	import is from "date-fns/locale/is";
	import {
		progress_writable,
		curr_model_writable,
		map_writable,
		phi_writable,
	} from "./LoadingModalWritable.js";

	const forceUpdate = async (_) => {};

	let loadingMap = new Map<string, number>();
	let pr = 1;
	let other_loading = false;
	let is_phi_loading = false;
	let is_phi = false;

	phi_writable.subscribe((value) => {
		is_phi = value;
		if (value) {
			other_loading = true;
		}
	});

	map_writable.subscribe((value) => {
		const [model, percent] = value;
		pr = Number(percent);
		if (model != undefined && model.startsWith("onnx")) {
			is_phi_loading = false;
			loadingMap.set(model, Math.floor(Number(percent)));
		} else if (model != undefined && model.endsWith("gguf")) {
			is_phi_loading = false;
			loadingMap.set(model, Math.floor(Number(percent)));
		}
		if (loadingMap.size > 0) {
			is_phi_loading = false;
			other_loading = true;
			loadingMap.forEach((per, model, map) => {
				if (per < 100 && loadingMap.size > 0) {
					other_loading = false;
				}
			});
		}
	});
</script>

<Modal>
	<div class="flex w-full flex-col gap-0 p-2">
		<div class="flex items-start text-xl font-bold text-gray-800">
			<h2>Loading the model...</h2>
		</div>
		<br />
		{#await forceUpdate(pr) then _}
			{#if other_loading == false}
				<div class="text-s flex items-start text-gray-800">
					Please wait while we download the model. This has to be done only once.
					<br />
				</div>
				{#if is_phi_loading == false}
					<br />
					{#each [...loadingMap] as [key, value]}
						<p class="text-s text-gray-800">{key}</p>
						<div class="w3-light-grey">
							<div class="w3-blue" style="width:{value}%">{value}%</div>
						</div>
						<br />
					{/each}
				{:else}
					<div class="text-left">
						<div role="status">
							<svg
								aria-hidden="true"
								class="mr-2 inline h-8 w-8 animate-spin fill-gray-600 text-gray-200 dark:fill-gray-300 dark:text-gray-600"
								viewBox="0 0 100 101"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
							>
								<path
									d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
									fill="currentColor"
								/>
								<path
									d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
									fill="currentFill"
								/>
							</svg>
							<span class="sr-only">Loading...</span>
						</div>
					</div>
				{/if}
			{:else}
				<div class="text-s flex items-start text-gray-800">Loading the model into memory...</div>
				<div class="text-left">
					<div role="status">
						<svg
							aria-hidden="true"
							class="mr-2 inline h-8 w-8 animate-spin fill-gray-600 text-gray-200 dark:fill-gray-300 dark:text-gray-600"
							viewBox="0 0 100 101"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
						>
							<path
								d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
								fill="currentColor"
							/>
							<path
								d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
								fill="currentFill"
							/>
						</svg>
						<span class="sr-only">Loading...</span>
					</div>
				</div>
			{/if}
		{/await}
	</div>
</Modal>
