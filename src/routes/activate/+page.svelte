<script lang="ts">
	export let data;
	
</script>



<div class="mt-6 space-y-1">
    {#if data.status == "OK"}
	<h2 class="text-2xl font-semibold tracking-tight">Email successfully verified</h2>
	<p class="text-sm text-muted-foreground">You can now proceed to <a href="/login">login</a>.</p>
    {:else if data.status == "INV"}
    <h2 class="text-2xl font-semibold tracking-tight">Your token is invalid</h2>
    {/if}
</div>