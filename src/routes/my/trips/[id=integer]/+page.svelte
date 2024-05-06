<script lang="ts">
	import { type FormSchema, formSchema } from './schema';
	// export let data;
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { redirect } from '@sveltejs/kit';
	import { goto, invalidateAll } from '$app/navigation';
	import * as Avatar from '$lib/components/ui/avatar/index.js';
	import * as Select from '$lib/components/ui/select/index.js';
	import * as Dialog from '$lib/components/ui/dialog/index.js';
	import { Label } from '$lib/components/ui/label/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import SuperDebug, { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { tick } from 'svelte';
	import Check from 'lucide-svelte/icons/check';
	import { LoaderCircle } from 'lucide-svelte';
	import ChevronsUpDown from 'lucide-svelte/icons/chevrons-up-down';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import * as Form from '$lib/components/ui/form/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Command from '$lib/components/ui/command/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { cn, fetchPostAPI } from '$lib/utils.js';
	import LocationCover from '$lib/components/trips/location-cover.svelte';
	export let data;
	import { ArrowRightFromLine } from 'lucide-svelte';
	import { enhance as eSv } from '$app/forms';

	import '@carbon/charts-svelte/styles.css';
	import { DonutChart } from '@carbon/charts-svelte';

	const options = {
		title: 'Places analytics',
		resizable: true,
		legend: {
			alignment: 'center'
		},
		donut: {
			center: {
				label: 'Places'
			},
			alignment: 'center'
		},
		height: '300px',
		theme: 'g10'
	};

	let fData: SuperValidated<Infer<FormSchema>> = data.form;
	console.log(data);

	let predicitions: any[] = [];

	async function fetchLocations(lang: string) {
		const res = await fetch(`/utils/getlocation?input=${lang}`, {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json'
			}
		});
		const b = await res.json();
		predicitions = b.data.predictions;
		console.log(predicitions);
	}

	let value = '';
	$: {
		if (value != '') {
			let oldVal = value;
			setTimeout(() => {
				if (value == oldVal) {
					fetchLocations(oldVal);
				}
			}, 500);
		}
	}

	const dateOptions = { year: 'numeric', month: 'long', day: 'numeric' } as const;
	const dateLocal = new Date(data.trip.start_date);

	const form = superForm(fData, {
		validators: zodClient(formSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Added ${f.data.location}`);
				dialogOpen = false;
				invalidateAll();
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance, delayed } = form;

	let open = false;
	let dialogOpen = false;

	// We want to refocus the trigger button when the user selects
	// an item from the list so users can continue navigating the
	// rest of the form with the keyboard.
	function closeAndFocusTrigger(triggerId: string) {
		open = false;
		tick().then(() => {
			document.getElementById(triggerId)?.focus();
		});
	}

	const get = async () => {
		const res = await fetch(`/utils/export-excel?trip=${data.trip.id}`);
		const blob = await res.blob();
		const newBlob = new Blob([blob]);

		const blobUrl = window.URL.createObjectURL(newBlob);

		const link = document.createElement('a');
		link.href = blobUrl;
		link.setAttribute('download', `trip.xls`);
		document.body.appendChild(link);
		link.click();
		//@ts-ignore
		link.parentNode.removeChild(link);

		// clean up Url
		window.URL.revokeObjectURL(blobUrl);
	};
</script>

<div class="">
	<h2 class="text-3xl font-semibold tracking-tight">{data.trip.name}</h2>
	<h4 class="mb-4 text-lg tracking-tight">
		Your trip starting on {dateLocal.toLocaleDateString('en-US', dateOptions)}
	</h4>
	<Button
		class="mb-5"
		on:click={() => {
			get();
		}}
	>
		<ArrowRightFromLine class="mr-2 h-4 w-4" />
		Export trip
	</Button>
	<Separator />
</div>
<div class="space-y-4">
	<h2 class="text-xl font-semibold tracking-tight">Trip locations</h2>
	<div class="ml-auto mr-4">
		<Dialog.Root bind:open={dialogOpen}>
			<Dialog.Trigger class={buttonVariants({ variant: 'outline' })}>New location</Dialog.Trigger>
			<Dialog.Content class="sm:max-w-[600px]">
				<Dialog.Header>
					<Dialog.Title>Add new location</Dialog.Title>
					<Dialog.Description>Which city are you travelling to now?</Dialog.Description>
				</Dialog.Header>
				<form method="POST" action="?/new_location" class="space-y-6" use:enhance>
					<Form.Field {form} name="location" class="flex flex-col">
						<Popover.Root bind:open let:ids>
							<Form.Control let:attrs>
								<Form.Label>Location</Form.Label>
								<Popover.Trigger
									class={cn(
										buttonVariants({ variant: 'outline' }),
										'justify-between',
										!$formData.location && 'text-muted-foreground'
									)}
									role="combobox"
									{...attrs}
								>
									{$formData.location}

									<ChevronsUpDown class="ml-2 h-4 w-4 shrink-0 opacity-50" />
								</Popover.Trigger>
								<input hidden value={$formData.location} name={attrs.name} />
								<input hidden value={$formData.place_id} name="place_id" />
							</Form.Control>
							<Popover.Content class="w-[400px] p-0">
								<Command.Root shouldFilter={false}>
									<Command.Input
										autofocus
										disabled={$delayed || null}
										bind:value
										placeholder="Search location..."
										class="h-9"
									/>
									<Command.Empty
										>{#if value == ''}
											Start typing...
										{:else}
											No location found.
										{/if}</Command.Empty
									>
									<Command.Group>
										{#each predicitions as pred}
											<Command.Item
												value={pred.description}
												onSelect={() => {
													$formData.location = pred.description;
													$formData.place_id = pred.place_id;
													closeAndFocusTrigger(ids.trigger);
												}}
											>
												{pred.description}
												<Check
													class={cn(
														'ml-auto h-4 w-4',
														pred.description !== $formData.location && 'text-transparent'
													)}
												/>
											</Command.Item>
										{/each}
									</Command.Group>
								</Command.Root>
							</Popover.Content>
						</Popover.Root>
						<Form.FieldErrors />
					</Form.Field>

					<!-- {#if browser}
					<div class="max-w-[400px]">
						<SuperDebug data={$formData} /></div>
					{/if} -->

					<Dialog.Footer>
						{#if $delayed}
							<LoaderCircle class="animate-spin" />
						{:else}
							<Form.Button class="mt-7">Add</Form.Button>
						{/if}
					</Dialog.Footer>
				</form>
			</Dialog.Content>
		</Dialog.Root>
	</div>
	<div class="space-y-4">
		<!-- <h4 class="text-sm font-medium"></h4> -->
		<div class="grid grid-cols-2 gap-6 sm:grid-cols-2 md:grid-cols-6 lg:md:grid-cols-8">
			{#each data.locations as location}
				<LocationCover
					{location}
					tripId={data.trip.id}
					class="w-[120px]"
					aspectRatio="square"
					width={120}
					height={150}
				/>
			{/each}
		</div>
	</div>
</div>

<DonutChart data={data.stats} {options} />
