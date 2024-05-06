<script lang="ts">
	import SuperDebug, { type Infer, type SuperValidated, superForm } from 'sveltekit-superforms';
	import { zodClient } from 'sveltekit-superforms/adapters';
	import { toast } from 'svelte-sonner';
	import { browser } from '$app/environment';
	import * as Form from '$lib/components/ui/form/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { formSchema, type FormSchema } from './schema';
	import { LoaderCircle } from 'lucide-svelte';
	export let data;
	export let fdata: SuperValidated<Infer<FormSchema>> = data.form;
	const form = superForm(fdata, {
		validators: zodClient(formSchema),
		onUpdated: ({ form: f }) => {
			if (f.valid) {
				toast.success(`Password reset link successfully sent. Please check your email.`);
			} else {
				toast.error('Please fix the errors in the form.');
			}
		}
	});

	const { form: formData, enhance, delayed } = form;
</script>



<div class="mt-6 space-y-1">
	<h2 class="text-2xl font-semibold tracking-tight">Forgot your password?</h2>
	<p class="text-sm text-muted-foreground">Restore it via e-mail</p>
</div>

<form action="?" method="POST" class="w-1/3 space-y-6" use:enhance>
	<Form.Field {form} name="email">
		<Form.Control let:attrs>
			<Form.Label>E-mail</Form.Label>
			<Input {...attrs} bind:value={$formData.email} />
		</Form.Control>
		<Form.Description>Enter the email address for your account</Form.Description>
		<Form.FieldErrors />
	</Form.Field>
	{#if $delayed}
		<Form.Button class="" disabled>
			<LoaderCircle class="animate-spin" />
			</Form.Button>
	{:else}
		<Form.Button class="">Submit</Form.Button>
	{/if}
	<!-- {#if true}
		<SuperDebug data={$formData} />
	{/if} -->
</form>
