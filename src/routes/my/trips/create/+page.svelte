<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { default as CalendarIcon } from 'lucide-svelte/icons/calendar';
	import {
		type DateValue,
		DateFormatter,
		getLocalTimeZone,
		parseDate,
		CalendarDate,
		today
	} from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { Button, buttonVariants } from '$lib/components/ui/button/index.js';
	import { Calendar } from '$lib/components/ui/calendar/index.js';
	import * as Popover from '$lib/components/ui/popover/index.js';
	import * as Form from '$lib/components/ui/form/index.js';
	import type { SuperValidated, Infer } from 'sveltekit-superforms';
	import SuperDebug, { superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { formSchema, type FormSchema } from './schema';
	import { Input } from '$lib/components/ui/input';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		dataType: 'json',
		validators: zodClient(formSchema),
		taintedMessage: null,
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success('You submitted' + JSON.stringify(f.data, null, 2));
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance } = form;

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let value: DateValue | undefined;

	$: value = $formData.start_date ? parseDate($formData.start_date) : undefined;

	let placeholder: DateValue = today(getLocalTimeZone());
</script>

<form method="POST" use:enhance>
	<Form.Field {form} name="name">
		<Form.Control let:attrs>
			<Form.Label>Trip name</Form.Label>
			<Input {...attrs} bind:value={$formData.name} />
		</Form.Control>
		<Form.Description>The name of your trip</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="destination">
		<Form.Control let:attrs>
			<Form.Label>Destination</Form.Label>
			<Input {...attrs} bind:value={$formData.destination} />
		</Form.Control>
		<Form.Description>Where are you going?</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	<Form.Field {form} name="start_date" class="flex flex-col">
		<Form.Control let:attrs>
			<Form.Label>Trip start date</Form.Label>
			<Popover.Root>
				<Popover.Trigger
					{...attrs}
					class={cn(
						buttonVariants({ variant: 'outline' }),
						'w-[280px] justify-start pl-4 text-left font-normal',
						!value && 'text-muted-foreground'
					)}
				>
					{value ? df.format(value.toDate(getLocalTimeZone())) : 'Pick a date'}
					<CalendarIcon class="ml-auto h-4 w-4 opacity-50" />
				</Popover.Trigger>
				<Popover.Content class="w-auto p-0" side="bottom">
					<Calendar
						{value}
						bind:placeholder
						minValue={today(getLocalTimeZone())}
						calendarLabel="Date of birth"
						initialFocus
						onValueChange={(v) => {
							if (v) {
								$formData.start_date = v.toString();
							} else {
								$formData.start_date = '';
							}
						}}
					/>
				</Popover.Content>
			</Popover.Root>
			<Form.Description>When does your trip start?</Form.Description>
			<Form.FieldErrors />
			<input hidden value={$formData.start_date} name={attrs.name} />
		</Form.Control>
	</Form.Field>
	<Form.Button>Submit</Form.Button>
</form>
