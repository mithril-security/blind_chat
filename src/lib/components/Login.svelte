<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import CarbonClose from "~icons/carbon/close";
    import TextModal from "$lib/components/TextModal.svelte";
    import { Textfield, Checkbox } from "svelte-mui";
	import Modal from "$lib/components/straightModal.svelte";
	import { is_logged_writable, is_magic_writable } from "../../routes/LayoutWritable";

    let email = "";
    let email2 = "";
    let password = "";
    let showPassword = false;
    let magicSuccess = false;
    let subscribeNewsletter = false; // The subscribeNewsletter value
    let error; // This will be set accordingly as per your error handling
    let hasAccount = true;

    const dispatch = createEventDispatcher<{ close: void }>();

    function toggleAccountStatus() {
    hasAccount = !hasAccount;
}

    async function sendMagicLink(event: { preventDefault: () => void }) {
    event.preventDefault();
    const data = {
        email2,
        subscribeNewsletter,
    };

    try {
        const response = await fetch("https://cloud.mithrilsecurity.io/api/auth/blindChatRegister", {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });

        if (response.ok) {
            // Handle a successful response
            console.log("Registration successful");
            magicSuccess = true;
        } else {
            console.log(response);
            // Handle errors
            console.error("Registration failed");
        }
    } catch (error) {
        // Handle network errors
        console.error("Network error", error);
    }
	}

    // Assuming usePost and useSession are related to fetching, you would replace them with standard fetch API calls or any other libraries you use with Svelte.
    async function apiCallLogin(arg: { email: string; password: string; }) {
        // Simulating the 'usePost' functionality
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arg)
        });
        // handle response, error, etc.
        return response.json();
    }

    async function registerUser(arg: { email: string; }) {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(arg)
        });
        // handle response, error, etc.
        return response.json();
    }

    function reloadSession() {
        // Simulate 'useSession'. This will be specific to how you manage sessions in your Svelte app.
    }

    // I'll assume that you have a Svelte-based router and will pseudo-code it:
    function navigateTo(route: string) {
        // Use your Svelte-based routing library to navigate.
    }

    // useForm might be a complex hook that you need to break down, but I'm providing a basic structure:
    function submitForm() {
        if(email && password) { // Basic validation
            apiCallLogin({email, password})
                .then(result => {
                    if(result.success) { // Assuming the API returns a success field
                        reloadSession();
                        navigateTo('/home');
                    } else {
                        error = result.error;
                    }
                });
        }
    }

    // For toggling the password visibility:
    function handleClickShowPassword() {
        showPassword = !showPassword;
    }

    function handleMouseDownPassword(event: { preventDefault: () => void; }) {
        event.preventDefault();
    }

    function handleClick() {
        dispatch("close");
        is_logged_writable.set(true);
        is_magic_writable.set(true);

    }

</script>

<Modal on:close>
    <script>
		import Overlay from 'svelte-overlay';
		let overlayComp	  
	  <Overlay bind:this={overlayComp} />
	  overlayComp.setTheme();
	</script>
    <div class="border border-gray-200 pt-4 px-12 pb-12 bg-white dark:bg-darkBackground dark:text-white" style="min-width: 450px;">
        <div class = "flex justify-end">
        <button type="button" class="group text-black dark:text-white" on:click={handleClick}>
            <CarbonClose />
        </button>
    </div>
            <div class="flex justify-between items-end">
                <div class="font-bold text-3xl dark:text-white">
                {#if hasAccount}
                    Sign in
                {:else}
                    Sign up
                {/if}
                </div>
                <button type="button" class="underline" on:click={toggleAccountStatus}>                    
                    {#if hasAccount}
                        I don't have an account
                    {:else}
                        I have an account
                    {/if}
                </button>
            </div>            
        {#if hasAccount}
        <div class="lg:min-h-[430px] py-4" style="max-width: 350px">
        <form on:submit={submitForm}>
        <div class="py-4 flex justify-between items-center flex-wrap gap-2.5 border-1 border-black dark:border-gray">
        <input id="email1" 
        class="p-2 w-full border-1 border-black dark:border-gray"
        style="border: 1px solid black; color:black;"
        type="email" bind:value={email} placeholder="Email" />
        </div>
        <div class="py-4 flex justify-between items-center flex-wrap gap-2.5 border-1 border-black dark:border-gray relative">
            <!-- Text input for the "shown" password -->
                <input 
                type="text"
                class="text-black p-2 w-full border-1 border-black dark:border-gray pr-10"
                style="border: 1px solid black; color:black;"
                bind:value={password} 
                placeholder="Password" 
                class:hidden={!showPassword}
                />                
                <input
                class="text-black p-2 w-full border-1 border-black dark:border-gray pr-10"
                style="border: 1px solid black; color:black;"
                type="password" 
                bind:value={password} 
                placeholder="Password" 
                class:hidden={showPassword}
            />
            <svg 
                class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv toggle-visibility-icon absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer"
                focusable="false" 
                aria-hidden="true" 
                viewBox="0 0 24 24" 
                on:click={handleClickShowPassword}
                style="width: 24px; height: 24px;" 
            >
                <path fill="#808080" d="M12 6c3.79 0 7.17 2.13 8.82 5.5C19.17 14.87 15.79 17 12 17s-7.17-2.13-8.82-5.5C4.83 8.13 8.21 6 12 6m0-2C7 4 2.73 7.11 1 11.5 2.73 15.89 7 19 12 19s9.27-3.11 11-7.5C21.27 7.11 17 4 12 4zm0 5c1.38 0 2.5 1.12 2.5 2.5S13.38 14 12 14s-2.5-1.12-2.5-2.5S10.62 9 12 9m0-2c-2.48 0-4.5 2.02-4.5 4.5S9.52 16 12 16s4.5-2.02 4.5-4.5S14.48 7 12 7z"></path>
            </svg>
        </div>
        
        <!-- ErrorIcon logic can be added here -->
        <div class="py-3 flex justify-left items-center flex-wrap gap-2.5 border-1 border-black dark:border-gray">
            <button class="p-3 flex justify-right content-center bg-yellow-500 text-black rounded-lg min-w-36 py-2 px-3 text-center" 
            type="submit">
            Sign in with password
            </button>
        </div>
        <div class="p-3 underline justify-right text-right">
            <!-- Error handling can be placed here -->
            <a href="/auth/resetPassword">Forgot Password?</a>
        </div>
        <div class="flex items-center justify-center relative">
            <div class="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
            <span class="MuiDivider-wrapper css-c1ovea relative z-10 px-4 bg-white dark:bg-darkBackground">OR</span>
        </div>                
        <div class="py-3 flex justify-between items-center flex-wrap gap-2.5 border-1 border-black dark:border-gray">
        <input 
        class="text-black p-2 w-full border-1 border-black dark:border-gray pr-10"
        style="border: 1px solid black; color:black;"
        type="email" bind:value={email2} placeholder="Email" />
        </div>
        <Checkbox
        bind:checked={subscribeNewsletter}
        label="Subscribe to Newsletter"
        type="checkbox"
        id="subscribeNewsletter"
        >
        Subscribe to Newsletter
        </Checkbox>
        <div class="py-3 flex justify-left items-center flex-wrap gap-2.5 border-1 border-black dark:border-gray">
            <button class="p-3 flex content-center bg-yellow-500 text-black rounded-lg min-w-36 py-2 px-3 text-center" 
            on:click={sendMagicLink}>Sign in with magic link ✨</button>
            {#if magicSuccess}
            <TextModal title="Magic link sent" text="✅ Check your emails for your magic login link"  on:close={() => (magicSuccess = false)}/>
            {/if}
        </div>
    </form>
    </div>
        {:else if !hasAccount}
        <div class="relative flex flex-col space-y-4 lg:min-h-[450px] py-4" style="max-width: 350px">
        <div class="py-4 flex justify-between items-center flex-wrap gap-2.5 border-1 border-black dark:border-gray">
            <input id="email1" 
            class="p-2 w-full border-1 border-black dark:border-gray"
            style="border: 1px solid black; color:black;"
            type="email" bind:value={email} placeholder="Email" />
        </div>
        <div class="pt-3 flex justify-left items-center flex-wrap gap-2.5 border-1 border-black dark:border-gray">
                <button class="p-3 flex content-center bg-yellow-500 text-black rounded-lg min-w-36 py-2 px-3 text-center" 
                on:click={registerUser}>Sign up</button>
                <Checkbox
                bind:checked={subscribeNewsletter}
                label="Subscribe to product updates"
                type="checkbox"
                id="subscribeNewsletter"
                >
                Subscribe to product updates
                </Checkbox>
            </div>
            <p class="absolute bottom-0 left-0 mt-auto" style="font-size: 15px;">
                By signing up, you agree to the{' '}
                <a href="https://www.mithrilsecurity.io/privacy-policy" target="_blank" style="color: #967000;">Terms of Service</a>.
            </p>
        </div>
        {/if}   
    </div>
</Modal>
