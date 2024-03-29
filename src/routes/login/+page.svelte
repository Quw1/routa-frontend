<script lang="ts">
    import type { PageData } from "./$types.js";
    import SettingsForm from "./login-form.svelte";
    export let data: PageData;
    import { Toaster } from 'svelte-sonner'
  </script>
   
  <SettingsForm data={data.form} />
  <Toaster/>