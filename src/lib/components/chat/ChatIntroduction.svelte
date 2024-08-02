<script lang="ts">
	import { PUBLIC_APP_NAME, PUBLIC_VERSION } from "$env/static/public";
	import { PUBLIC_ANNOUNCEMENT_BANNERS } from "$env/static/public";
	import Logo from "$lib/components/icons/Logo.svelte";
	import { createEventDispatcher } from "svelte";
	import IconChevron from "$lib/components/icons/IconChevron.svelte";
	import CarbonArrowUpRight from "~icons/carbon/arrow-up-right";
	import AnnouncementBanner from "../AnnouncementBanner.svelte";
	import ModelsModal from "../ModelsModal.svelte";
	import type { Model } from "$lib/types/Model";
	import ModelCardMetadata from "../ModelCardMetadata.svelte";
	import type { LayoutData } from "../../../routes/$types";
	import { findCurrentModel } from "$lib/utils/models";
	import { env } from "$env/dynamic/public";
	import { curr_model_writable } from "../../../routes/LayoutWritable";

	export let currentModel: Model;
	export let settings: LayoutData["settings"];
	export let models: Model[];

	let isModelsModalOpen = false;
	let selectedNum = 0;

	curr_model_writable.subscribe((val) => {
		selectedNum = val;
	});

	$: currentModelMetadata = findCurrentModel(models, models[selectedNum].name);

	const announcementBanners = PUBLIC_ANNOUNCEMENT_BANNERS
		? JSON.parse(PUBLIC_ANNOUNCEMENT_BANNERS)
		: [];

	const dispatch = createEventDispatcher<{ message: string }>();

	function getTitles(str: string) {
		const split = str.split(' ')
		const map_str = new Map();
		for (let i = 0; i < split.length; i++) {
			map_str.set(i, split[i])
		}
    	return map_str
	}

	$: title = env.PUBLIC_APP_NAME;
</script>

<div class="my-auto  gap-8 ">
	<div class=" text-customBlack flex justify-center">
		<div>
			<div class="mb-3 flex items-center justify-center text-[42px]  font-semibold">
				<Logo classNames="mr-1 flex-none w-[73px] h-[62px]" />
				<div class = "pl-2  "> {PUBLIC_APP_NAME} </div>
			</div>
			<p class="text-xl  ">
				Enjoying the best AI models, with privacy
			</p>
		</div>
	</div>
	<!-- <div class="lg:col-span-2 lg:pl-24">
		{#each announcementBanners as banner}
			<AnnouncementBanner classNames="mb-4" title={banner.title}>
				<a
					target="_blank"
					href={banner.linkHref}
					class="mr-2 flex items-center underline hover:no-underline"
					><CarbonArrowUpRight class="mr-1.5 text-xs" /> {banner.linkTitle}</a
				>
			</AnnouncementBanner>
		{/each}
		{#if isModelsModalOpen}
			<ModelsModal
				{settings}
				{models}
				on:close={() => (isModelsModalOpen = false)}
				on:closeAndSave={(id) => (
					(isModelsModalOpen = false), curr_model_writable.set(id.detail.id)
				)}
			/>
		{/if}
		{#if models.length > 1}
		<div class="overflow-hidden rounded-xl border dark:border-gray-800">
			<div class="flex p-3">
				<div>
					<div class="text-sm text-gray-600 dark:text-gray-400">Current Model</div>
					<div class="font-semibold">{currentModel.displayName}</div>
				</div>
				{#if models.length > 1}
					<button
						type="button"
						on:click={() => (isModelsModalOpen = true)}
						class="btn ml-auto flex h-7 w-7 self-start rounded-full bg-gray-100 p-1 text-xs hover:bg-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:hover:bg-gray-600"
						><IconChevron /></button
					>
				{/if}
			</div>
			<ModelCardMetadata variant="dark" model={currentModel} />
		</div>
		{/if}
	</div> -->
	{#if currentModelMetadata.promptExamples}
		<div class="lg:col-span-2 mt-14">
			<div class="grid gap-3 lg:grid-cols-3 lg:gap-5">
				{#each currentModelMetadata.promptExamples as example}
					<button
						type="button"
						class="rounded-xl p-2.5 text-newPrimary hover:bg-gray-100  dark:bg-tertiary dark:text-newPrimary dark:customHover sm:p-4"
						on:click={() => {
							dataLayer.push({ event: "prompt", titre_prompt: [example.title] });
							dispatch("message", example.prompt)}
					}
					>
				
						
							{example.title + " "} 
				
			
					</button>
				{/each}
			</div>
		</div>{/if}
</div>
