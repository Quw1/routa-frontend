<script lang="ts">
    import { Toaster } from "svelte-sonner";
    import type { PageData } from "./$types.js";
    import SettingsForm from "./sign-up-form.svelte";
    export let data: PageData;
  </script>
   
  <SettingsForm data={data.form} />
  <Toaster/>