<script lang="ts">
	export let classNames = "";
</script>

<div class={"inline-flex h-8 flex-none items-center gap-1 " + classNames}>
	<div
		class="h-1 w-1 flex-none animate-bounce rounded-full bg-newPrimary dark:bg-newPrimary"
		style="animation-delay: 0.25s;"
	/>
	<div
		class="h-1 w-1 flex-none animate-bounce rounded-full bg-newPrimary dark:bg-newPrimary"
		style="animation-delay: 0.5s;"
	/>
	<div
		class="h-1 w-1 flex-none animate-bounce rounded-full bg-newPrimary dark:bg-newPrimary"
		style="animation-delay: 0.75s;"
	/>
</div>
