<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import Overlay from 'svelte-overlay';
    import CarbonClose from "~icons/carbon/close";
    import TextModal from "$lib/components/TextModal.svelte";
    import { Textfield, Checkbox } from "svelte-mui";
	import Modal from "$lib/components/BigModal.svelte";
	import { is_logged_writable, is_magic_writable } from "../../routes/LayoutWritable";

    let email = "";
    let email2 = "";
    let password = "";
    let showPassword = false;
    let magicSuccess = false;
    let loginFail = false;
    let magicFail = false;
    let magicView = false;
    let subscribeNewsletter = false; // The subscribeNewsletter value
    let error; // This will be set accordingly as per your error handling
    let hasAccount = true;

    const dispatch = createEventDispatcher<{ close: void }>();

    function toggleAccountStatus() {
    hasAccount = !hasAccount;
    magicView = false;
}

    function setMagicView() {
        hasAccount = !hasAccount;
        magicView = true;
    }

    async function sendMagicLink(event: { preventDefault: () => void }) {
    event.preventDefault();

    const data = {
        email: email2,
        subscribeNewsletter,
    };

    console.log("magic link");
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
            magicSuccess = true;
            console.log(response)
            // Handle a successful response
            console.log("Registration successful");
            magicSuccess = true;
        } else {
            magicFail = true;
            console.log(response);
            // Handle errors
            console.error("Registration failed");
        }
    } catch (error) {
        // Handle network errors
        console.error("Network error", error);
    }
	}

    async function apiCallLogin(arg: { email: string; password: string; }) {
        const data = {
        email,
        password,
        };
        console.log("logging in...")
        try {
        const response = await fetch('https://cloud.mithrilsecurity.io/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok)
        {
            console.log(response)
            is_logged_writable.set(true)
        }
        else {
            loginFail = true;
            console.error("Login failed");
        }
        } catch (error) {
            console.error("Network error", error);
    }
    }

    async function registerUser(arg: { email: string; }) {
        const data = {
        email,
        };
        console.log("registering user")
        try {
        const response = await fetch('https://cloud.mithrilsecurity.io/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok)
        {
        magicSuccess = true;
        }
        else {
            magicFail = true;
            console.log("problem")
            console.log(response);
            // Handle errors
            console.error("Registering failed");
        }
        } catch (error) {
        // Handle network errors
        console.error("Network error", error);
    }
    }

    function reloadSession() {
    }

    function submitForm() {
        if(email && password) { // Basic validation
            apiCallLogin({email, password})
                .then(result => {
                    if(result.success) { 
                        reloadSession();
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

</script>

<Modal on:close>
    <script>
		let overlayComp	  
	  <Overlay bind:this={overlayComp} />
	  overlayComp.setTheme();
	</script>
    <div class="border rounded-2xl border-mithril-border pt-4 px-12 pb-12 bg-login text-white md:min-w-[450px]">
        <div class = "pb-4 flex justify-end">
            <div>
                <button type="button" class="underline" on:click={toggleAccountStatus}>                    
                    {#if hasAccount}
                        I don't have an account
                    {:else if magicView}
                        Return
                    {:else}
                        I have an account
                    {/if}
                </button>
            </div>            
    </div>
            <div class="flex justify-center">
                <div class="font-bold text-3xl text-mithril-yellow">
                {#if hasAccount}
                    Sign in
                {:else}
                    Sign up
                {/if}
                </div>
                </div>
        {#if hasAccount}
        <script>
            document.getElementById("login").style.display = "block";
        </script>
        <div id="login" class="py-4" style="max-width: 350px">
        <form on:submit={submitForm}>
        <div class="pt-4 flex justify-between items-center flex-wrap gap-2.5 border-1 border-gray">
        <input id="email1" 
        class="bg-login rounded text-white border border-mithril-border p-2 w-full"
        type="email" bind:value={email} placeholder="Email" />
        </div>
        <div class="py-4 flex justify-between items-center flex-wrap gap-2.5 border-1 border-gray relative">
            <!-- Text input for the "shown" password -->
                <input 
                type="text"
                class="text-black p-2 w-full border-1 border-gray pr-10"
                style="border: 1px solid black; color:black;"
                bind:value={password} 
                placeholder="Password" 
                class:hidden={!showPassword}
                />                
                <input
                class="bg-login rounded text-white border border-mithril-border p-2 w-full"
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
        <div class="py-3 flex justify-center items-center flex-wrap gap-2.5 border-1 border-gray">
            <button class="p-3 flex justify-right content-center bg-mithril-yellow text-black rounded-lg min-w-36 py-2 px-3 text-center" 
            type="submit">
            Sign in
            </button>
        </div>
        {#if loginFail}
                <TextModal title="Login failed" text="Please check your credentials try again"  on:close={() => (loginFail = false)}/>    
        {/if}
        <div class="p-3 underline justify-right text-right">
            <!-- Error handling can be placed here 
            <button on:click={resetPassword}>Forgot Password?</button>
            -->
        </div>
    </form>
        <div class="flex items-center justify-center relative">
            <div class="absolute top-1/2 left-0 right-0 h-px bg-gray-300"></div>
            <span class="MuiDivider-wrapper css-c1ovea relative z-10 px-4 bg-login">OR</span>
        </div>
        <div class="pt-4 pb-0 flex justify-center items-center flex-wrap gap-2.5">
        <button class="bg-login rounded text-white border border-mithril-yellow p-2 w-full"
        on:click={setMagicView}>Sign in with magic link ✨</button>
        </div>
        </div>
        {:else if magicView}
            <script>
                document.getElementById("login").style.display = "none";
            </script>
            <div class="py-3 flex justify-between items-center flex-wrap gap-2.5 border-1 border-gray">
            <input 
            class="bg-login rounded text-white border border-mithril-border p-2 w-full"
            type="email" bind:value={email2} placeholder="Email" />
            </div>
            <Checkbox
            bind:checked={subscribeNewsletter}
            label="Subscribe to Newsletter"
            type="checkbox"
            id="subscribeNewsletter"
            >
            Subscribe to product updates
            </Checkbox>
            <div class="py-3 flex justify-center py-4 items-center flex-wrap gap-2.5 border-1 border-gray">
                <button class="p-3 flex content-center bg-yellow-500 text-black rounded-lg min-w-36 py-2 px-3 text-center" 
                on:click={sendMagicLink}>Sign in with magic link ✨</button>
                {#if magicSuccess}
                <TextModal title="Magic link sent" text="✅ Check your emails for your magic login link"  on:close={() => (magicSuccess = false)}/>
                {:else if magicFail}
                <TextModal title="Error" text="Please check your email address is valid and try again"  on:close={() => (magicFail = false)}/>
                {/if}
        </div>
        {:else if !hasAccount && !magicView}
        <script>
            document.getElementById("login").style.display = "none";
        </script>
        <div class="relative flex flex-col space-y-4 pt-4" style="max-width: 350px">
        <div class="pt-4 flex justify-between items-center flex-wrap gap-2.5 border-1 border-gray">
            <input id="email1" 
            class="bg-login rounded text-white border border-mithril-border p-2 w-full"
            type="email" bind:value={email} placeholder="Email" />
        </div>
        <div class="flex justify-center items-center flex-wrap gap-2.5 border-1 order-gray">
            <Checkbox
            bind:checked={subscribeNewsletter}
            label="Subscribe to product updates"
            type="checkbox"
            id="subscribeNewsletter"
            >
            Subscribe to product updates
            </Checkbox>
            <button class="p-3 flex content-center bg-yellow-500 text-black rounded-lg min-w-36 py-2 px-3 text-center" 
            on:click={registerUser}>Sign up</button>
            {#if magicSuccess}
                <TextModal title="Sign in link sent" text="✅ Check your emails for your login link"  on:close={() => (magicSuccess = false)}/>
            {:else if magicFail}
            <TextModal title="Error" text="Please check your email address is valid and try again"  on:close={() => (magicFail = false)}/>
            {/if}
            <p class="pt-5">
                By signing up, you agree to the{' '}<a class="text-mithril-yellow" href="https://www.mithrilsecurity.io/privacy-policy" target="_blank">Terms of Service</a>.
            </p>
        </div>
        </div>
        {/if}   
    </div>
</Modal>
