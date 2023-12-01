<script lang="ts">
    import { createEventDispatcher } from "svelte";
    import { PUBLIC_APP_ASSETS, PUBLIC_ORIGIN } from "$env/static/public";
    import { page } from "$app/stores";
    import TextModal from "$lib/components/TextModal.svelte";
    import { Checkbox } from "svelte-mui";
	import Modal from "$lib/components/BigModal.svelte";
	import { api_key_writable, email_addr_writable, is_logged_writable, is_magic_writable } from "../../routes/LayoutWritable";
	import { goto } from "$app/navigation";
	import { base } from "$app/paths";
    import { getApiKey } from "../../routes/tools";

    let email = ""; // email for login view
    let email2 = ""; // email for magic link view
    let password = "";
    let showPassword = false;
    let magicSuccess = false;
    let loginFail = false;
    let magicFail = false;
    let magicView = false;
    let subscribeNewsletter = true;
    let error;
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

    async function isLogged() {
		try {
			const response = await fetch("https://cloud.mithrilsecurity.io/api/auth/getUserInfo", {
				method: "GET",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
			});
			if (response.ok) {
				const res = await response.text()
				const json: JSON = JSON.parse(res)
				email_addr_writable.set(json.email)
			} 
			else {
				// Handle errors here
				console.error("User is not logged in");
			}
		} catch (err) {
			// Handle network errors here
			console.error("Network error", err);
		}
	}

    async function sendMagicLink(event: { preventDefault: () => void }) {
    event.preventDefault();

    const data = {
        email: email2,
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
        dataLayer.push({'event': 'signup-start'});
        if (response.ok) {
            magicSuccess = true;
        } else {
            magicFail = true;
        }
    } catch (error) {
        console.error("Network error", error);
    }
	}

    async function apiCallLogin(arg: { email: string; password: string; }) {
        const data = {
        email,
        password,
        };
        let result = {
            success:true,
            error:"",
        }
        console.log("logging in...")
        try {
        const response = await fetch('https://cloud.mithrilsecurity.io/api/auth/login', {
            method: 'POST',
            credentials: "include",
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (response.ok)
        {
            console.log(await response.text())
            is_logged_writable.set(true)
            api_key_writable.set(await getApiKey());
            isLogged()
            result.success = true;
        }
        else {
            loginFail = true;
            console.error("Login failed");
            result.error = "Login failed";
        }
        } catch (error) {
            console.error("Network error", error);
            result.error = "Login failed";
    }
    return result;
    }

    async function registerUser(arg: { email: string; }) {
        const data = {
        email,
        };
        console.log("registering user")
        try {
        const response = await fetch('https://cloud.mithrilsecurity.io/api/auth/blindChatRegister', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        dataLayer.push({'event': 'signup-start'});
        if (response.ok)
        {
            magicSuccess = true;
            api_key_writable.set(await getApiKey());
        }
        else {
            magicFail = true;
        }
        } catch (error) {
        console.error("Network error", error);
    }
    }

    function reloadSession() {
        
    }

    function submitForm() {
        if(email && password) { // Basic validation
            apiCallLogin({email, password}) // TODO: sort out error handling here
                .then(result => {
                    console.log(result)
                    if(result.success) { 
                        reloadSession();
                        goto(`${base}/`, { invalidateAll: true });                  
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
                <!-- Top right link text -->
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
                <!-- Title of modal -->
                <div class="font-bold text-3xl text-mithril-yellow">
                {#if hasAccount}
                    Sign in
                {:else if magicView}
                    Sign in
                {:else}
                    Sign up
                {/if}
                </div>
                </div>
        <!-- VIEW #1 Classic sign in view -->
        {#if hasAccount}
        <script>
            document.getElementById("login").style.display = "block";
        </script>
        <div id="login" class="py-4" style="max-width: 350px">
        <form on:submit={submitForm}>
        <div class="pt-4 flex justify-between items-center flex-wrap gap-2.5 border-1 border-gray">
         <!-- Classic sign in view -->
        {#if loginFail}
                <TextModal title="Login failed" text="Please check your credentials try again"  on:close={() => (loginFail = false)}/>    
        {/if}
    </form>
        <!-- Magic link screen button -->
        <div class="pt-4 pb-0 flex justify-center items-center flex-wrap gap-2.5">
            <a href="https://cloud.mithrilsecurity.io/api/auth/google" class="space-x-2 flex justify-center text-center bg-login rounded-2xl text-white border border-mithril-yellow p-2 w-full">
                <img
                    alt=""
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                    class="h-6 rounded-full"
                />
                    <div>
                        Sign in with Google
                    </div>
                </a>
            <a href="https://cloud.mithrilsecurity.io/api/auth/github" class="space-x-2 flex justify-center bg-login rounded-2xl text-white border border-mithril-yellow p-2 w-full">
        <img
			alt=""
			src="https://camo.githubusercontent.com/b079fe922f00c4b86f1b724fbc2e8141c468794ce8adbc9b7456e5e1ad09c622/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f6769746875622e737667"
			class="h-6 rounded-full"
		/>
        <div>
            Sign in with Github
        </div>
        </a> 
        <button class="bg-login rounded-2xl text-white border border-mithril-yellow p-2 w-full"
        on:click={setMagicView}>✨ Sign in with magic link</button>
        </div>
        </div>
        <!-- VIEW #2 Magic link -->
        {:else if magicView}
            <script>
                document.getElementById("login").style.display = "none";
            </script>
            <div class="relative flex flex-col space-y-4 pt-4" style="max-width: 350px">
            <div class="py-3 flex justify-between items-center flex-wrap gap-2.5 border-1 border-gray">
            <input 
            class="bg-login rounded-2xl text-white border border-mithril-border p-2 w-full"
            type="email" bind:value={email2} placeholder="Email" />
            </div>
            <div class="flex justify-center items-center flex-wrap gap-2.5 border-1 order-gray">
                <button class="p-3 flex content-center bg-yellow-500 text-black rounded-lg min-w-36 py-2 px-3 text-center" 
                on:click={sendMagicLink}>Sign in with magic link ✉️ </button>
                {#if magicSuccess}
                <TextModal title="Magic link sent" text="✅ Check your emails for your magic login link"  on:close={() => (magicSuccess = false)}/>
                {:else if magicFail}
                <TextModal title="Error" text="Please check your email address is valid and try again"  on:close={() => (magicFail = false)}/>
                {/if}
                <p class="pt-5">
                    By using our services, you agree to the{' '}<a class="text-mithril-yellow" href="https://www.mithrilsecurity.io/privacy-policy" target="_blank">Terms of Service</a>.
                </p>
            </div>
        </div>
        <!-- VIEW #3 Sign up -->
        {:else if !hasAccount && !magicView}
        <!-- force get rid of login view in background -->
        <script>
            document.getElementById("login").style.display = "none";
        </script>
        <div class="relative flex flex-col space-y-4 pt-4" style="max-width: 350px">
        <!-- email input -->
        <div class="pt-4 flex justify-between items-center flex-wrap gap-2.5 border-1 border-gray">
            <input id="email1" 
            class="bg-login rounded-2xl text-white border border-mithril-border p-2 w-full"
            type="email" bind:value={email} placeholder="Email" />
        </div>
        <div class="flex justify-center items-center flex-wrap gap-2.5 border-1 order-gray">
            <button class="p-3 flex content-center bg-yellow-500 text-black rounded-lg min-w-36 py-2 px-3 text-center" 
            on:click={registerUser}>Sign up</button>
        <a href="https://cloud.mithrilsecurity.io/api/auth/google" class="space-x-2 flex justify-center text-center bg-login rounded-2xl text-white border border-mithril-yellow p-2 w-full">
                <img
                    alt=""
                    src="https://upload.wikimedia.org/wikipedia/commons/c/c1/Google_%22G%22_logo.svg"
                    class="h-6 rounded-full"
                />
                    <div>
                        Sign in with Google
                    </div>
        </a> 
        <a href="https://cloud.mithrilsecurity.io/api/auth/github" class="space-x-2 flex justify-center bg-login rounded-2xl text-white border border-mithril-yellow p-2 w-full">
        <img
			alt=""
			src="https://camo.githubusercontent.com/b079fe922f00c4b86f1b724fbc2e8141c468794ce8adbc9b7456e5e1ad09c622/68747470733a2f2f6564656e742e6769746875622e696f2f537570657254696e7949636f6e732f696d616765732f7376672f6769746875622e737667"
			class="h-6 rounded-full"
		/>
        <div>
            Sign in with Github
        </div>
        </a>            
            {#if magicSuccess}
            <TextModal title="Thank you" text="✅ Please click on the magic link we have sent you to access your account"  on:close={() => (magicSuccess = false)}/>
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
