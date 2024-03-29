import type { PageServerLoad, Actions, Action } from "./$types.js";
import { fail, redirect } from "@sveltejs/kit";
import { setError, superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
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

  const res = await fetch(`${BackendURL}/auth/login/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(form.data)
  });

  if (res.ok) {
    const responseData = await res.json();
      console.log(responseData['data']['tokens']['access'])
      console.log(responseData['data']['tokens']['refresh'])
      event.cookies.set('access_token', responseData['data']['tokens']['access'], {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      });

      event.cookies.set('refresh_token', responseData['data']['tokens']['refresh'], {
        path: '/',
        httpOnly: true,
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60 * 24 * 30,
      });

    throw redirect(303, '/');


  } else {
    const responseData = await res.json();
    const err = responseData.errors;
    if (err.detail === 'EMAILNOTVER') {
      return setError(form, 'email', 'Please verify your email first');
    } else if (err.detail === 'INVALIDCRED') {
      return setError(form, 'email', 'Invalid email and/or password'), setError(form, 'password', 'Invalid email or password');
    } else if (err.detail === 'ACCDIS') {
      return setError(form, 'email', 'Your account is disabled'), setError(form, 'password', 'Your account is disabled');
    } else {
      throw new Error(String(err));
    }


  }




};

export const actions: Actions = {
  default: login
};