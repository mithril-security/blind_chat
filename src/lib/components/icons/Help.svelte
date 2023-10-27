<script lang="ts">
	import { page } from "$app/stores";
	import { PUBLIC_APP_ASSETS, PUBLIC_APP_NAME, PUBLIC_ORIGIN } from "$env/static/public";
	import { base } from "$app/paths";
	export let classNames = "";
	
	function toggleHelpMenu() {
	}

	function handleKeyDown(event: { key: string; }) {
    if (event.key === 'Enter') {
      toggleHelpMenu();
    }
  	}

</script>
<img
	alt="help menu button"
	on:click={toggleHelpMenu}
	on:keydown={handleKeyDown}
	class={classNames}
	src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/help.png"
	title="help button"
	width="20"  
	height="20" 
/>
