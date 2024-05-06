<script lang="ts">
	export let data;
	import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
	import { toast } from "svelte-sonner";
    import { formSchema, type FormSchema } from "./schema";
    import { LoaderCircle } from "lucide-svelte";
    import {
      type SuperValidated,
      type Infer,
      superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
   
    export let fdata: SuperValidated<Infer<FormSchema>> = data.form;
   
    const form = superForm(fdata, {
      validators: zodClient(formSchema),
      onUpdated: ({ form: f }) => {
			if (f.message == "Password changed successfuly") {
                toast.success('Password changed successfuly');
            }
            else {
                toast.error('Ivalid or expired reset link');
            }
		}
    });
   
    const { form: formData, enhance, delayed, message } = form;
</script>
{#if data.status == "ok"}
<form method="POST" class="space-y-6" use:enhance>
    {#if $message}
    <h1 class="text-lg">{$message}</h1>
{/if}
    <Form.Field {form} name="password" class="flex flex-col">
            <Form.Control let:attrs>
                <Form.Label>Your new password</Form.Label>
                <Input {...attrs} bind:value={$formData.password} type="password" />
            </Form.Control>
           
        <Form.FieldErrors />
    </Form.Field>

    <!-- {#if browser}
    <div class="max-w-[400px]">
        <SuperDebug data={$formData} /></div>
    {/if} -->


        {#if $delayed}
            <LoaderCircle class="animate-spin" />
        {:else}
            <Form.Button class="mt-7">Reset password</Form.Button>
        {/if}
</form>
{:else}
<h1 class="text-lg">Invalid or expired link, try requesting password reset again</h1>
{/if}





<!-- <div class="mt-6 space-y-1">
    {#if data.status == "OK"}
	<h2 class="text-2xl font-semibold tracking-tight">Email successfully verified</h2>
	<p class="text-sm text-muted-foreground">You can now proceed to <a href="/login">login</a>.</p>
    {:else if data.status == "INV"}
    <h2 class="text-2xl font-semibold tracking-tight">Your token is invalid</h2>
    {/if}
</div> -->