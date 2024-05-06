import { BackendURL } from '$lib';
import { fail, redirect, type Action, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { formSchema } from './schema';
import { toast } from 'svelte-sonner';

export async function load({ params, url }) {
    const token = params.token;
    const uid = params.uid;
    if (token == "" || token == null || token === undefined || uid == "" || uid == null || uid === undefined) {
        throw redirect(302, "/")
    }
    try {
        const res = await fetch(`${BackendURL}/auth/password-reset/${uid}/${token}/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (res.ok) {
            return { form: await superValidate(zod(formSchema)), status: 'ok' }
        }
        else {
            return { form: await superValidate(zod(formSchema)), status: 'error' }
        }

    } catch (error) {
        throw new Error(String(error));
    }
}

const register: Action = async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
        return fail(400, {
            form,
        });
    }

    try {
        const data = {
            password: form.data.password,
            token: event.params.token,
            uidb64: event.params.uid
        }
        const res = await fetch(`${BackendURL}/auth/password-reset-complete`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        console.log(res.ok);
        if (res.ok) {
            return message(form, 'Password changed successfuly');
        }
        else {     
            return message(form, 'Ivalid or expired reset link');
        }
    } catch (error) {
        throw new Error(String(error));
    }



};

export const actions: Actions = {
    default: register
};