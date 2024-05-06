import type { PageServerLoad, Actions, Action } from "./$types.js";
import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema.js";
import { zod } from "sveltekit-superforms/adapters";
import { BackendURL } from "$lib";

export const load: PageServerLoad = async () => {
  return {
    form: await superValidate(zod(formSchema)),
  };
};

const login: Action = async (event) => {
  const form = await superValidate(event, zod(formSchema));
  if (!form.valid) {
    return fail(400, {
      form,
    });
  }
  console.log(form.data);
  console.log(JSON.stringify(form.data));

  const res = await fetch(`${BackendURL}/auth/request-password-reset/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form.data)
  });


  return {form};

 




};

export const actions: Actions = {
  default: login
};