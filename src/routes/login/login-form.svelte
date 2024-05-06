<script lang="ts">
    import * as Form from "$lib/components/ui/form";
    import { Input } from "$lib/components/ui/input";
	import { LoaderCircle } from "lucide-svelte";
    import { formSchema, type FormSchema } from "./schema";
    import {
      type SuperValidated,
      type Infer,
      superForm,
    } from "sveltekit-superforms";
    import { zodClient } from "sveltekit-superforms/adapters";
   
    export let data: SuperValidated<Infer<FormSchema>>;
   
    const form = superForm(data, {
      validators: zodClient(formSchema),
    });
   
    const { form: formData, enhance, delayed } = form;
  </script>
   <div class="flex">
  <form class="w-[280px] justify-start pl-4 text-left font-normal m-auto" method="POST" use:enhance>
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
        <Form.FieldErrors />
      </Form.Field>
      {#if $delayed}
      <Form.Button class="" disabled>
        <LoaderCircle class="animate-spin" />
        </Form.Button>
    {:else}
      <Form.Button class="">Login</Form.Button>
    {/if}
  </form></div>