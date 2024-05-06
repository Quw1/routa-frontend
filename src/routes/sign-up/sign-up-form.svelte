<script lang="ts">
	import * as Form from '$lib/components/ui/form';
	import { Input } from '$lib/components/ui/input';
	import { toast } from 'svelte-sonner';
	import { formSchema, type FormSchema } from './schema';
	import { LoaderCircle } from 'lucide-svelte';
	import { type SuperValidated, type Infer, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { goto } from '$app/navigation';

	export let data: SuperValidated<Infer<FormSchema>>;

	const form = superForm(data, {
		validators: zodClient(formSchema),
		onUpdated: ({ form: f }) => {
			if (f.message == 'Registered successfully, confirm your email') {
				toast.success('Registered successfully, confirm your email');
			} else {
				toast.error('Check your data and try again');
			}
		}
	});

	const { form: formData, enhance, delayed } = form;
</script>

<div class="flex">
	<form class="m-auto w-[280px] justify-start pl-4 text-left font-normal" method="POST" use:enhance>
		<Form.Field {form} name="username">
			<Form.Control let:attrs>
				<Form.Label>Username</Form.Label>
				<Input {...attrs} bind:value={$formData.username} />
			</Form.Control>
			<Form.Description>This is your public display name</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="email">
			<Form.Control let:attrs>
				<Form.Label>E-mail</Form.Label>
				<Input {...attrs} bind:value={$formData.email} />
			</Form.Control>
			<Form.Description>Please enter your email</Form.Description>
			<Form.FieldErrors />
		</Form.Field>
		<Form.Field {form} name="password">
			<Form.Control let:attrs>
				<Form.Label>Password</Form.Label>
				<Input {...attrs} bind:value={$formData.password} />
			</Form.Control>
			<Form.Description>This is your password</Form.Description>
			<Form.Description
				>Forgot your password? <a class="font-semibold text-black" href="/forgot-password">Reset</a
				></Form.Description
			>
			<Form.FieldErrors />
		</Form.Field>
		{#if $delayed}
			<Form.Button class="mt-4" disabled>
				<LoaderCircle class="animate-spin" />
			</Form.Button>
		{:else}
			<Form.Button class="mt-4">Sign up</Form.Button>
		{/if}
	</form>
</div>
