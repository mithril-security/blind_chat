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
    <div class="w-600 relative border rounded-2xl border-[#52a1e3] bg-[#030e1a] text-white">
      <button
        type="button"
        class="absolute top-2 right-2 text-[#52a1e3] group-hover:text-gray-500"
        on:click={(closePopUp)}
      >
        <CarbonClose />
      </button>
      <div class="max-w-2xl mx-auto p-3 md:p-6">
        <img
          alt="Ai confidential mode logo"
          src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/ai_mode.png"
          class="w-30 h-20 mx-auto mt-5"
        />
        <h2 class="text-2xl text-center font-semibold pt-8 pb-4 md:pb-8">You are entering Confidential AI mode</h2>
        <p class="text-center text-gray-400">
        Prompts are end-to-end protected. We cannot see your queries, responses, chat history,
          or any login information to guarantee your privacy.
          <a
            href="https://www.mithrilsecurity.io/privacy-policy#new-pp"
            target="_blank"
            rel="noopener noreferrer"
            class="text-mithril-yellow hover:underline"
          >
            Learn more
          </a>
        </p>
        <div class="text-center pt-8 md:pt-14">
          <button
            class="w-60 bg-[#52a1e3] text-white rounded-2xl py-3 px-3 text-center p-8"
            on:click={(closePopUp)}
          >
            Get started
          </button>
          <div class="pt-4 md:pt-6">
            <button
              class="w-60 border border-[#52a1e3] text-white rounded-2xl py-3 px-3 text-center"
              on:click={openContactPage}
            >
              Contact us for more
            </button>
          </div>
        </div>
        <p class="text-gray-400 md:text-normal text-center pt-20 md:mt-16">
          AI generated answers may be inaccurate or false
        </p>
      </div>
    </div>
  </Modal>
  
  
  
  
  
  
  