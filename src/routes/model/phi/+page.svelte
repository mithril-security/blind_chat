<script lang="ts">
	import { goto, invalidate } from "$app/navigation";
	import { PUBLIC_APP_NAME } from "$env/static/public";
	import { base } from "$app/paths";
	import { onMount } from "svelte";
	import { curr_model_writable } from "../../../routes/LayoutWritable";

	onMount(() => {
		curr_model_writable.set(1);
		goto(`/`, { invalidateAll: true });
	});
</script>

<svelte:head>
	<title>{PUBLIC_APP_NAME}</title>
</svelte:head>
