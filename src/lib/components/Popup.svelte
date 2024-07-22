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
    <div class=" max-h-[90vh] overflow-y-auto  border rounded-2xl  bg-secondary text-white ">
    
      <div class="max-w-3xl p-6 py-10  m-4 md:m-10 rounded-2xl bg-newPrimary relative ">
        <button
        type="button"
        class="absolute top-3 right-3 text-customBlack group-hover:text-gray-500"
        on:click={(closePopUp)}
      >
        <CarbonClose class='text-xl customHover' />
      </button>
        <img
          alt="Ai confidential mode logo"
          src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/popup_confidential.png"
          class=" w-[80px] h-[68px]  md:w-[192px] md:h-[161.68px] mx-auto "
        />
        <h2 class="text-2xl sm:text-4xl text-center font-semibold pt-8 pb-4 md:pb-8 text-tertiary">You are entering Confidential AI mode</h2>
        <p class="text-center text-customBlack mx-2 text-sm sm:text-base ">
        Prompts are end-to-end protected. We cannot see your queries, responses, chat history,
          or any login information to guarantee your privacy.
          <a
            href="https://blindchat.mithrilsecurity.io/en/latest/"
            target="_blank"
            rel="noopener noreferrer"
            class="text-tertiary hover:underline"
          >
            Learn more
          </a>
        </p>
        <div class="text-center pt-8 md:pt-14">
          <button
            class="sm:w-60 bg-tertiary w-[93%] font-semibold text-white rounded-2xl py-3 px-3 text-center p-8 customHover"
            on:click={(closePopUp)}
          >
            Get started
          </button>
          <div class="pt-4 md:pt-6">
            <button
              class="sm:w-60 border w-[93%]   border-tertiary text-tertiary rounded-2xl py-3  text-center customHover"
              on:click={openContactPage}
            >
              Contact us for more
            </button>
          </div>
        </div>
        <p class="text-customBlack text-xs sm:text-base text-center pt-20 md:mt-16">
          AI generated answers may be inaccurate or false
        </p>
      </div>
    </div>
  </Modal>
  
  
  
  
  
  
  