<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import Overlay from 'svelte-overlay';
	import Modal from "$lib/components/BigModal.svelte";
	import Modal2 from "$lib/components/straightModal.svelte";
	import TextModal from "$lib/components/TextModal.svelte";
	import { writable } from 'svelte/store';
	import CarbonClose from "~icons/carbon/close";
	import type { Model } from "$lib/types/Model";
	import type { LayoutData } from "../../routes/$types";

	export let settings: LayoutData["settings"];
	export let models: Array<Model>;

	let opSuccess = false;
	let opFail = false;
	let emailOpSuccess = false;
	let emailOpFail = false;
	let mismatch = false;
	let isConfirmingDeletion = false;
	let isAccountView: boolean = true;
	let isThemeView: boolean = false;
	let newEmail = '';
	const themeStore = writable(
		localStorage.theme
	);
	
	const dispatch = createEventDispatcher<{ close: void }>();

	export function switchTheme() {
	const { classList } = document.querySelector("html") as HTMLElement;
	classList.add("dark");
	localStorage.theme = "dark";
	themeStore.set('dark');
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
				credentials: "include",
			});
		}
	
	async function changeEmail(newEmail: string) {
    try {
	const data = {
        newEmail,
    };
      const response = await fetch('https://cloud.mithrilsecurity.io/api/auth/changeEmail', {
        method: 'POST',
		credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
		emailOpSuccess = true;
      } else {
		emailOpFail = true;
      }
    } catch (error) {
      console.error('Error:', error);
    }
	}

	async function changePassword(newPassword: string, confirmPassword: string) {
    try {
      if (newPassword !== confirmPassword) {
        mismatch = true;
        return;
    }

      	const response = await fetch('https://cloud.mithrilsecurity.io/api/auth/changePassword', {
        method: 'POST',
		credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ new_password: newPassword }),
      });

      if (response.ok) {
		opSuccess = true;
      } else {
        opFail = true;
      }
    } catch (error) {
      // Handle any network or request error here
      console.error('Error:', error);
    }
  }

  let newPassword = '';
  let confirmPassword = '';

  async function handlePasswordChange() {
    await changePassword(newPassword, confirmPassword);
  }

  async function handleEmailChange(newEmail: string) {
    	await changeEmail(newEmail);
	}
</script>

<Modal on:close>
	<script>
		let overlayComp	  
	  <Overlay bind:this={overlayComp} />
	  overlayComp.setTheme();
	</script>
	<div class="border rounded-2xl border-mithril-border pt-4 px-12 pb-12 bg-login text-white md:min-w-[700px]">
		{#if isAccountView}
			<div class="text-2xl py-4 dark:text-white">Account</div>
		{/if}
		
		<button type="button" class="group text-black dark:text-white" on:click={() => dispatch("close")} style="position: absolute; right: 15px;">
			<CarbonClose />
		</button>
	</div>
	
	<div id="modal" class="bg-white dark:bg-login dark:text-white md:min-w-[700px]" style="display: flex; font-family: Sora,sans-serif;">	
		<div class = "md:min-w-[500px] md:min-h-[400px]" style="flex: 4; margin-right:40px; padding 15px 15px;">
		<!-- Account modal view -->
		{#if isAccountView}
	<script type="text/javascript">
		document.getElementById("themeView").style.display = "block";
	</script>
		<div class="modal-content pl-5" id="accountView"> 
		
			<!-- Change email section -->
		<h2 class="pt-8 font-medium text-xl text-mithril-yellow">Change email</h2>
		<p>New email address</p>
		<div class="pt-4 flex justify-between items-center flex-wrap gap-2.5 border-1 border-gray">
    	<input type="email" 
		placeholder="Enter new email address" 
		class="bg-login rounded text-white border border-mithril-border p-2 w-full"
		bind:value={newEmail} style="border: 1px solid black; color:black;" />
    	<button class="bg-yellow-500 text-black rounded-lg min-w-36 py-2 px-3" style="justify-content: space-between;" on:click={handleEmailChange(newEmail)}>Change Email</button>
		{#if emailOpSuccess}
			<TextModal title="Email updated" text="Please click on the confirmation link that has been sent to your updated email address."  on:close={() => (emailOpSuccess = false)}/>
		{:else if emailOpFail}
			<TextModal title="Update failed" text="Please check the email address entered is valid" on:close={() => (emailOpFail = false)}/>
		{/if}
		</div>

		<!-- Create password section -->
		<h2 class="pt-8 font-medium text-xl" style="color: #f0ba2d;">Create password</h2>
		<p>New password</p>
		<input type="password" placeholder="Enter new password" class="p-2 w-3/5 max-w-xs flex-1" style="border: 1px solid black; color:black;" >
		<p style="padding-top:20px;">Confirm password</p>
		<div class="border-1 border-black dark:border-gray flex justify-between items-center flex-wrap gap-2.5">
		<input type="password" placeholder="Confirm new password" class="p-2 w-3/5 max-w-xs flex-1" style="justify-content: space-between; border: 1px solid black; color:black;" bind:value={confirmPassword}/>
		<button class="bg-yellow-500 text-black rounded-lg min-w-36 py-2 px-3" style="justify-content: space-between;" on:click={handlePasswordChange}>Create password</button>
		{#if opSuccess}
			<TextModal title="Password updated" text="✅ Your password has successfully been created"  on:close={() => (opSuccess = false)}/>
		{:else if opFail}
			<TextModal title="Update failed" text={mismatch === true ? "Passwords don't match" : "Unexpected error. Please try again"} on:close={() => (opFail = false, mismatch = false)}/>
		{/if}
		</div>

		<!-- Delete account section -->
		<h2 class="pt-8 font-medium text-xl" style="color: #f0ba2d;">Delete account</h2>
		<div class="flex justify-between items-center flex-wrap gap-2.5 py-5">
			<button on:click = {() => (isConfirmingDeletion = true)}
				class="rounded-lg min-w-36 py-2 px-3 ml-auto border-1 border-red :hover bg-red-700 text-white">Delete account</button>
			{#if isConfirmingDeletion}
			<Modal2 on:close={() => (isConfirmingDeletion = false)}>
				<form class="dark:bg-darkBackground flex w-full flex-col gap-5 p-6 dark:border dark:border-gray-400">
					<div class="flex items-start justify-between text-xl font-semibold text-gray-800">
						<h2 class="dark:text-white font-medium text-xl">Are you sure?</h2>
						<button type="button" class="group" on:click={() => (isConfirmingDeletion = false)}>
							<CarbonClose class="text-gray-900 dark:text-gray-400 group-hover:text-gray-500"/>
						</button>
					</div>
					<p class="dark:text-gray-400 text-gray-800">This action will delete your account.<br>This cannot be undone.</p>
					<button
						type="button"
						class="mt-2 rounded-full bg-red-700 px-5 py-2 text-lg font-semibold text-gray-100 ring-gray-400 ring-offset-1 transition-all hover:ring focus-visible:outline-none focus-visible:ring"
						on:click={deleteAccount}
					>
						Confirm
					</button>
				</form>
			</Modal2>
		{/if}
		</div>
	</div>
{/if}
	</div>
	</div>
</Modal>
