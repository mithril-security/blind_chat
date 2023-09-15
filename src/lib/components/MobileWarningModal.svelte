<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$lib/components/Modal.svelte";
	import CarbonClose from "~icons/carbon/close";
	import Switch from "$lib/components/Switch.svelte";
	import { enhance } from "$app/forms";
	import { base } from "$app/paths";
	import { PUBLIC_APP_DATA_SHARING } from "$env/static/public";
	import type { Model } from "$lib/types/Model";
	import type { LayoutData } from "../../routes/$types";

	const dispatch = createEventDispatcher<{ close: void }>();
</script>

<Modal>
	<div class="flex w-full flex-col gap-5 p-6">
		<div class="flex items-start justify-between text-xl font-semibold text-gray-800">
			<h2>Warning</h2>
		</div>
		<p class="text-gray-800">
			This chat is still a beta. Therefore, it might have some issues on your phone. Use at your own
			risk.
		</p>
	</div>
</Modal>
