import type { Action, Actions, PageServerLoad } from "./$types.js";
import { superValidate } from "sveltekit-superforms";
import { formSchema } from "./schema";
import { zod } from "sveltekit-superforms/adapters";
import { fail, redirect } from "@sveltejs/kit";
import { fetchPostAPI } from "$lib/utils.js.js";

export const load: PageServerLoad = async () => {
    return {
        form: await superValidate(zod(formSchema)),
    };
};

const create: Action = async (event) => {
    const form = await superValidate(event, zod(formSchema));
    if (!form.valid) {
        return fail(400, {
            form,
        });
    }

    
    let d = form.data
    // @ts-ignore
	d = {...d, polyline: ''};

    
    
    const res = await fetchPostAPI('/trips/', 'POST', JSON.stringify(d), event.cookies);
    return redirect(302, '/my/trips');
}



export const actions: Actions = {
    default: create
};