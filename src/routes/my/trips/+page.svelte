<script lang="ts">
	import TripCover from '$lib/components/trips/trip-cover.svelte';
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import type { Trip } from '$lib/components/trips/trip';
	import BadgePlus from 'lucide-svelte/icons/badge-plus';
	import { Import } from 'lucide-svelte';
	import { redirect } from '@sveltejs/kit';
	import { goto } from '$app/navigation';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { enhance } from '$app/forms';
	export let data;
	export let form;

	import '@carbon/charts-svelte/styles.css';
	import { BarChartGrouped } from '@carbon/charts-svelte';

	const options = {
		title: 'Trips (Locations vs Places) analysis',
		axes: {
			left: {
				mapsTo: 'value'
			},
			bottom: {
				mapsTo: 'date',
				scaleType: 'time'
			}
		},
		height: '400px'
	};
	let dialogOpen: boolean = false;
</script>

<div class="mt-6 space-y-1">
	<h2 class="text-2xl font-semibold tracking-tight">Your trips</h2>
	<p class="text-sm text-muted-foreground">The trips you created. Journey awaits!</p>
</div>

<a class="ml-auto mr-4" href="trips/create">
	<Button class="mt-4">
		<BadgePlus class="mr-2 h-4 w-4" />
		Add trip
	</Button>
</a>

<Button
	class="mt-4"
	on:click={() => {
		dialogOpen = true;
	}}
>
	<Import class="mr-2 h-4 w-4" />
	Import trip
</Button>

<Dialog.Root bind:open={dialogOpen}>
	<Dialog.Content class="sm:max-w-[425px]">
		<Dialog.Header>
			<Dialog.Title>Import trip</Dialog.Title>
			<Dialog.Description>Choose the trip file to import it</Dialog.Description>
		</Dialog.Header>
		<form method="post" action="?/upload" use:enhance enctype="multipart/form-data">
			<div class="grid gap-4 py-4">
				{#if form?.not_excel}<p class="text-red-500">The file must be .xlx or .xlsx</p>{/if}
				{#if form?.no_file}<p class="err">You must provide a .xls or .xlsx file</p>{/if}
				<Label for="excel">XLS or XLSX file</Label>
				<Input
					id="excel"
					type="file"
					name="excel"
					required
					accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
				/>
			</div>

			<Dialog.Footer>
				<Button type="submit">Save changes</Button>
			</Dialog.Footer>
		</form>
	</Dialog.Content>
</Dialog.Root>

<Separator class="my-4" />
<div class="">
	<div class="grid grid-cols-4 gap-9">
		{#each data.trips as trip}
			<TripCover {trip} class="w-[250px]" aspectRatio="portrait" width={250} height={350} />
		{/each}
	</div>
</div>

<BarChartGrouped data={data.stats} {options} />
