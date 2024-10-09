<script lang="ts">
	import CarbonStopFilledAlt from "~icons/carbon/stop-filled-alt";

	export let classNames = "";
</script>

<button
	type="button"
	on:click
	class="btn flex  group h-9 rounded-lg border border-secondary bg-newPrimary px-3 py-1 shadow-sm text-customBlack/80 hover:text-customBlack transition-all hover:border-tertiary  dark:border-customGrey/60 dark:bg-newPrimary dark:hover:border-customBlack {classNames}"
>
	<CarbonStopFilledAlt class="-ml-1 mr-1 h-[1.25rem] w-[1.1875rem] group-hover:text-customBlack text-customGrey" /> Stop generating
</button>
