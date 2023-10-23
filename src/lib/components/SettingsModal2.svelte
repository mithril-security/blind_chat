<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Modal from "$lib/components/Modal.svelte";
	import { writable } from 'svelte/store';
	import CarbonClose from "~icons/carbon/close";
	import Switch from "$lib/components/Switch.svelte";
	import { enhance } from "$app/forms";
	import { base } from "$app/paths";
	import type { Model } from "$lib/types/Model";
	import type { LayoutData } from "../../routes/$types";

	export let settings: LayoutData["settings"];
	export let models: Array<Model>;

	let isConfirmingDeletion = false;
	let isAccountView: boolean = true;
	let isThemeView: boolean = false;
	const themeStore = writable(
		localStorage.theme
	);
	
	const dispatch = createEventDispatcher<{ close: void }>();

	export function switchTheme() {
	const { classList } = document.querySelector("html") as HTMLElement;
	if (classList.contains("dark")) {
		classList.remove("dark");
		localStorage.theme = "light";
		themeStore.set('light');

	} else {
		classList.add("dark");
		localStorage.theme = "dark";
		themeStore.set('dark');
	}
}
	function themeViewToggle() {
		isAccountView = false;
		isThemeView = true;
	}

	function accountViewToggle() {
		isAccountView = true;
		isThemeView = false;
	}

	async function deleteAccount() {
			isConfirmingDeletion = false;
			await fetch('/auth/deleteAccount', {
				method: "POST",
			});
		}
</script>

<style>
	/* Yellow Button Style */
	.yellow-button {
		padding: 8px 12px; /* top-bottom, left-right */
		background-color: #f0ba2d;
		min-width: 150px;
		color: black;
		border-radius: 8px; /* adjust for desired roundness */
	}

	.delete-button {
		padding: 8px 12px; /* top-bottom, left-right */
		border-radius: 8px; /* adjust for desired roundness */
		min-width: 150px;
	}

	/* Input Box Style */
	.input-box {
		flex: 1;
		padding: 8px; /* Internal padding for input */
		border: 1px solid gray;
		width: 60%; /* reduce the width */
		max-width: 300px; /* or adjust to desired max width */
	}

	/* Flex container for Delete account heading and button */
	.delete-container, .flex-container {
		display: flex;
		justify-content: space-between;
		align-items: center;
		flex-wrap: wrap; /* allows elements to wrap to next line if they don't fit */
		gap: 10px; /* space between flex children */
	}

	.delete-container {
		padding: 20px 0;
	}

	.create-pass-btn {
		align-items: right;
	}

	#accountView {
		padding-left: 20px; /* Left padding for the AccountView */
	}

	/* Padding for H2 headers */
	h2 {
		padding-top: 30px; /* or any other value you prefer */
		font-weight:500;
		font-size:larger;
	}

	/* Delete Button Style */
	.delete-button {
		border: 1px solid red;
		margin-left: auto; /* push it to the right */
	}

	.delete-button:hover {
		background-color: red;
		color: white; /* assuming text color should be white on red background */
	}

	t1 {
		color: white;
		font-size: 24px;
		padding: 15px 0;
	}

	.modal-content-theme {
        display: flex;
        padding: 20px 20px; /* Padding above the button. Adjust value as needed. */
    }
	</style>


<Modal on:close>
	<script>
		import Overlay from 'svelte-overlay';
	  
		let overlayComp	  
	  <Overlay bind:this={overlayComp} />
	  overlayComp.setTheme();
	</script>
	<div class="header" style="position: relative; display: flex; min-width:700px!important; font-family: Sora,sans-serif; background-color:#111827; text-align:center; justify-content: center; align-items: center; padding: 0 15px;">
		{#if isAccountView}
			<t1>Account</t1>
		{:else}
			<t1>Theme</t1>
		{/if}
		
		<button type="button" class="group" on:click={() => dispatch("close")} style="position: absolute; right: 15px; color: white;">
			<CarbonClose />
		</button>
	</div>
	
	<div id="modal" class="dark:text-white" style="display: flex; min-width:700px!important; font-family: Sora,sans-serif; background-color:#111827">
		<!-- Left-hand side menu -->
		<div class="side-menu" style="flex:1; display: flex; flex-direction: column; background-color: #131a28;">
			<button class="group flex h-11 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" id="accountButton" on:click={accountViewToggle} type="button">Account</button>
			<button class="group flex h-11 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700" id="themeButton" on:click={themeViewToggle} type="button">Theme</button>
		</div>
	
		<div class = views style="flex: 4; min-width:500px important; min-height:400px; margin-right:40px; padding 15px 15px;">
		<!-- Account modal view -->
		{#if isAccountView}
	<script type="text/javascript">
		document.getElementById("themeView").style.display = "block";
	</script>
	<div class="modal-content" id="accountView"> 
		<!-- Change email section -->
		<h2 style="color: #f0ba2d;">Change email</h2>
		<div class="flex-container">
			<input type="text" placeholder="email@example.com" class="input-box">
			<button class="yellow-button">Change email</button>
		</div>

		<!-- Create password section -->
		<h2 style="color: #f0ba2d;">Create password</h2>
		<p>New password</p>
		<input type="password" placeholder="Enter new password" class="input-box">
		<p style="padding-top:20px;">Confirm password</p>
		<div class="flex-container">
		<input type="password" placeholder="Confirm new password" class="input-box" style="justify-content: space-between;">
		<button class="yellow-button" style="justify-content: space-between;">Create password</button>
		</div>
		

		<!-- Delete account section -->
		<h2 style="color: #f0ba2d;">Delete account</h2>
		<div class="delete-container">
			<button on:click = {() => (isConfirmingDeletion = true)}
				class="delete-button"> Delete account</button>
			{#if isConfirmingDeletion}
			<Modal on:close={() => (isConfirmingDeletion = false)}>
				<form class="flex w-full flex-col gap-5 p-6">
					<div class="flex items-start justify-between text-xl font-semibold text-gray-800">
						<h2>Are you sure?</h2>
						<button type="button" class="group" on:click={() => (isConfirmingDeletion = false)}>
							<CarbonClose class="text-gray-900 group-hover:text-gray-500" />
						</button>
					</div>
					<p class="text-gray-800">
						This action will delete your account.<br>
						This cannot be undone.
					</p>
					<button
						type="button"
						class="mt-2 rounded-full bg-red-700 px-5 py-2 text-lg font-semibold text-gray-100 ring-gray-400 ring-offset-1 transition-all hover:ring focus-visible:outline-none focus-visible:ring"
						on:click={deleteAccount}
					>
						Confirm
					</button>
				</form>
			</Modal>
		{/if}
		</div>
	</div>
{/if}
				
		{#if isThemeView}
		<script type="text/javascript">
			document.getElementById("themeView").style.display = "block";
		</script>
		<!-- Theme modal view -->
        <div class="modal-content-theme" id="themeView">
        <button
		on:click={switchTheme}
		id="darkButton"
		type="button"
		class="yellow-button flex h-9 flex-none items-center gap-1.5 rounded-lg pl-3 pr-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700">
		Switch to {$themeStore === 'dark' ? 'light' : 'dark'} mode
		</button>
	</div>
		{/if}
	</div>
	</div>
</Modal>
