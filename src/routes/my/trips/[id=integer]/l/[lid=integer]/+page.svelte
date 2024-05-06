<script lang="ts">
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { flip } from 'svelte/animate';
	import { dndzone, type DndEvent } from 'svelte-dnd-action'
    export let data;
	import Separator from '$lib/components/ui/separator/separator.svelte';
	import ScrollArea from '$lib/components/ui/scroll-area/scroll-area.svelte';
	import type { Trip } from '$lib/components/trips/trip';
	import Button from '$lib/components/ui/button/button.svelte';
	import BadgePlus from 'lucide-svelte/icons/badge-plus';
    import * as Avatar from '$lib/components/ui/avatar/index.js';
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu";
	import { redirect } from '@sveltejs/kit';
	import { goto, invalidateAll } from '$app/navigation';
	import PlaceCover from '$lib/components/trips/place-cover.svelte';
    import * as Dialog from '$lib/components/ui/dialog/index.js';
    import * as Form from '$lib/components/ui/form/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
    import * as Command from '$lib/components/ui/command/index.js';
	import SuperDebug, { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { formSchema, type FormSchema } from './schema.js';
	import { toast } from 'svelte-sonner';
	import { tick } from 'svelte';
	import { buttonVariants } from '$lib/components/ui/button/index.js';
	import { cn } from '$lib/utils.js.js';
	import { Check, ChevronsUpDown, LoaderCircle } from 'lucide-svelte';
	import { browser } from '$app/environment';
	import { Input } from '$lib/components/ui/input/index.js';
	import { enhance } from '$app/forms';
    import PlaceCard from './placeComp.svelte';

    let fData: SuperValidated<Infer<FormSchema>> = data.form;

        const form = superForm(fData, {
		validators: zodClient(formSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Added ${f.data.place}`);
                dialogOpen = false;
				invalidateAll();
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance: enhanceSS, delayed } = form;

	let dialogOpen = false;

    let loadingDel = false;

</script>


<div class="mt-6 space-y-1">
	<h2 class="text-2xl font-semibold tracking-tight">Places @ {data.location.name}</h2>
	<p class="text-sm text-muted-foreground">Explore {data.location.name}! Add some cool pearls to see.</p>
</div>


<div class="ml-auto mr-4">
    <Dialog.Root bind:open={dialogOpen}>
        <Dialog.Trigger class="{buttonVariants({ variant: 'default' })}align-middle ">
            <BadgePlus class="mr-2 h-4 w-4" />
            New place
        </Dialog.Trigger>
        <Dialog.Content class="sm:max-w-[425px]">
            <Dialog.Header>
                <Dialog.Title>Add new place</Dialog.Title>
                <Dialog.Description>Where are you going now?</Dialog.Description>
            </Dialog.Header>
            <form method="POST" action="?/new_location" class="space-y-6" use:enhanceSS>
                <Form.Field {form} name="place" class="flex flex-col">
                        <Form.Control let:attrs>
                            <!-- <Form.Label>Place</Form.Label> -->
                            <Input {...attrs} bind:value={$formData.place} />
                        </Form.Control>
                    <Form.FieldErrors />
                </Form.Field>

                <!-- {#if browser}
                <div class="max-w-[400px]">
                    <SuperDebug data={$formData} /></div>
                {/if} -->
            
            <Dialog.Footer>
                {#if $delayed}
                <Button disabled class="mt-7"><LoaderCircle class="animate-spin" /></Button>
                {:else}
                <Form.Button class="mt-7">Add</Form.Button>
                {/if}
            </Dialog.Footer>
        </form>
        </Dialog.Content>
    </Dialog.Root>
</div>

<Separator class="my-4" />
<div class="space-y-4">
    <h4 class="text-sm font-medium">People with access</h4>
    <div class="grid gap-6 max-w-[400px]">
        {#each data.places as place}
        <PlaceCard {place}/>
        
        {/each}
    </div>
</div>