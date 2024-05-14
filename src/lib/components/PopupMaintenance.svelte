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

<Modal>
    <div class="w-600 relative border rounded-2xl border-[#52a1e3] bg-[#030e1a] text-white">
      <div class="max-w-2xl mx-auto p-3 md:p-10">
        <img
          alt="Ai confidential mode logo"
          src="{PUBLIC_ORIGIN || $page.url.origin}{base}/{PUBLIC_APP_ASSETS}/ai_mode.png"
          class="w-30 h-20 mx-auto mt-5"
        />
        <h2 class="text-2xl text-center font-semibold pt-8 pb-4 md:pb-8">BlindChat is in maintenance</h2>
        <p class="text-center text-gray-400">
          BlindChat is currently undergoing maintenance. If you want to use the previous version to test our Confidential AI, contact us at contact@mithrilsecurity.io.
        </p>
      </div>
    </div>
  </Modal>
  
  
  
  
  
  
  