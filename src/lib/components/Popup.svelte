<script lang="ts">
    import { base } from "$app/paths";
	import { PUBLIC_ORIGIN, PUBLIC_APP_ASSETS } from "$env/static/public";
    import { page } from "$app/stores";
    import CarbonClose from "~icons/carbon/close";
	import Modal from "$lib/components/BigModal.svelte";
	import { first_time_writable } from "../../routes/LayoutWritable";
    
    function closePopUp() {
		first_time_writable.set(false);
	}
    
    function openContactPage() {
    window.open("https://www.mithrilsecurity.io/contact", "_blank");
    }
</script>

<Modal on:close>
    <div class="relative border rounded-2xl border-[#52a1e3] bg-[#030e1a] text-white">
      <button
        type="button"
        class="absolute top-2 right-2 text-[#52a1e3] group-hover:text-gray-500"
        on:click={(closePopUp)}
      >
        <CarbonClose />
      </button>
      <div class="max-w-2xl mx-auto p-6">
        <img
          alt="Ai confidential mode logo"
          src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/ai_mode.png"
          class="w-30 h-20 mx-auto mt-5"
        />
        <h2 class="text-xl text-center font-semibold pt-8 mb-2">You are entering confidential AI mode</h2>
        <p class="text-center font-bold py-4">Prompts are end-to-end protected.</p>
        <p class="text-center">
          We cannot see your queries, responses, chat history,<br />
          or any login information to guarantee your privacy.
        </p>
        <div class="flex justify-center text-center pt-4">
          <a
            href="https://www.mithrilsecurity.io/privacy-policy#new-pp"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[#52a1e3] hover:underline"
          >
            Learn more
          </a>
        </div>
        <div class="text-center mt-8">
          <button
            class="bg-[#52a1e3] text-white rounded-2xl py-2 px-3 text-center"
            on:click={(closePopUp)}
          >
            Get started
          </button>
          <div class="mt-2">
            <button
              class="border border-[#f0ba2d] text-white rounded-2xl py-2 px-3 text-center"
              on:click={openContactPage}
            >
              Contact us for more
            </button>
          </div>
        </div>
        <p class="text-center mt-16">
          AI generated answers may be inaccurate or false.
        </p>
      </div>
    </div>
  </Modal>
  
  
  
  
  
  
  