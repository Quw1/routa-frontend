<script lang="ts">
	import { cn } from "$lib/utils.js";

	let className: string | undefined | null = undefined;
	export { className as class };
	export let data;
</script>

<nav class={cn("flex items-center space-x-4 lg:space-x-6", className)}>
	<a href="/" class="text-sm font-medium transition-colors hover:text-primary">
		Home
	</a>
	{#if data.user}
	<a
		href="/my/trips"
		class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
	>
		Trips
	</a>
	{:else}
	<a
		href="/login"
		class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
	>
		Login
	</a>
	<a
		href="/sign-up"
		class="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
	>
		Sign Up
	</a>
	{/if}
</nav>