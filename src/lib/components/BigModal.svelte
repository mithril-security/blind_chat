<script lang="ts">
	import { createEventDispatcher, onDestroy, onMount } from "svelte";
	import { cubicOut } from "svelte/easing";
	import { fade } from "svelte/transition";
	import Portal from "./Portal.svelte";
	import { browser } from "$app/environment";

	export let width = "sm-8-40";

	let backdropEl: HTMLDivElement;
	let modalEl: HTMLDivElement;

	const dispatch = createEventDispatcher<{ close: void }>();

	function handleKeydown(event: KeyboardEvent) {
		// close on ESC
		if (event.key === "Escape") {
			event.preventDefault();
			dispatch("close");
		}
	}

	function handleBackdropClick(event: MouseEvent) {
		if (event.target === backdropEl) {
			dispatch("close");
		}
	}

	onMount(() => {
		document.getElementById("app")?.setAttribute("inert", "true");
		modalEl.focus();
	});

	onDestroy(() => {
		if (!browser) return;
		// remove inert attribute if this is the last modal
		if (document.querySelectorAll('[role="dialog"]:not(#app *)').length === 1) {
			document.getElementById("app")?.removeAttribute("inert");
		}
	});
</script>

<Portal>
	<div
		role="presentation"
		tabindex="-1"
		bind:this={backdropEl}
		on:click={handleBackdropClick}
		transition:fade={{ easing: cubicOut, duration: 300 }}
		class="fixed inset-0 z-40 flex items-center justify-center backdrop-blur-sm p-8"
	>
		<div
			role="dialog"
			tabindex="-1"
			bind:this={modalEl}
			on:keydown={handleKeydown}
			class=" overflow-hidden rounded-2xl shadow-2xl outline-none -mt-10 {width}"
		>
			<slot />
		</div>
	</div>
</Portal>
