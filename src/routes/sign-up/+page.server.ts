import type { PageServerLoad, Actions, Action } from "./$types.js";
import { fail, redirect } from "@sveltejs/kit";
import { message, setError, superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { BackendURL } from "$lib";
import { toast } from 'svelte-sonner';
 
export const load: PageServerLoad = async ({locals}) => {
  if (locals.user) {
    throw redirect(302, '/');
  }
  return {
    form: await superValidate(zod(formSchema)),
  };
};

const register: Action =  async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
      return fail(400, {
        form,
      });
    }
    
    try {
      const res = await fetch(`${BackendURL}/auth/register/`, {
          method: 'POST',
          headers: {
              'Content-Type': 'application/json'
          },
          body: JSON.stringify(form.data)
      });

      if (res.ok) {
          const responseData = await res.json(); 
          return message(form, 'Registered successfully, confirm your email');
          
      } else {
        const responseData = await res.json(); 
        const err = responseData.errors;
        console.log(err);
        const err_name = Object.keys(err)[0] 
        if (err_name == 'email') {
          return setError(form, 'email', err.email);
        } else if (err_name == 'password') {
          return setError(form, 'password', err.password);
        } else if (err_name == 'username') {
          return setError(form, 'username', err.username);
        } else {
          throw new Error(`${err_name} ${err[err_name]}`);
        }

      }
  } catch (error) {
    throw new Error(String(error));
  }
   

    
};

export const actions: Actions = {
    default: register
};