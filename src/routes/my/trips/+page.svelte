<script lang="ts">
	export let data;
	import TripCover from '$lib/components/trips/trip-cover.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import type { Trip } from '$lib/components/trips/trip';
	import Button from '$lib/components/ui/button/button.svelte';
	import BadgePlus from 'lucide-svelte/icons/badge-plus';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';

	function goToCreate() {
		goto('trips/create');
	}
</script>

<div class="mt-6 space-y-1">
	<h2 class="text-2xl font-semibold tracking-tight">Your trips</h2>
	<p class="text-sm text-muted-foreground">The trips you created. Journey awaits!</p>
</div>

<div class="ml-auto mr-4">
	<Button on:click={goToCreate}>
		<BadgePlus class="mr-2 h-4 w-4" />
		Add trip
	</Button>
</div>

<Separator class="my-4" />
<div class="relative">
	<ScrollArea orientation="both">
		<div class="flex space-x-4 pb-4">
			{#each data.trips as trip}
				<TripCover {trip} class="w-[150px]" aspectRatio="square" width={150} height={150} />
			{/each}
		</div>
	</ScrollArea>
</div>
