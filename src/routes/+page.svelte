<script lang="ts">
  import { Button } from "$lib/components/ui/button";
  export let data;
</script>

<div class="mt-6 space-y-1">
	<h2 class="text-2xl font-semibold tracking-tight">Welcome to Routa</h2>
  {#if data.user}
	<h2 class="text-lg tracking-tight">Navigate to your <a class="text-blue-600" href="/my/trips">Trips</a> to get started</h2>
  {:else}
  <h2 class="text-lg tracking-tight">Please <a class="text-blue-600" href="/login">Login</a> to get started</h2>
  {/if}
</div>


   
  