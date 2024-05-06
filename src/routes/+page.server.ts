import type { PageServerLoad, Actions, Action } from "./$types.js";
import { fetchPostAPI } from "$lib/utils.js";
import { redirect } from "@sveltejs/kit";
import type { Trip } from "$lib/components/trips/trip.js";


export const load: PageServerLoad = async ({cookies, locals}) => {

    return {user: locals.user,}
        
        

    // return {
    //   form: await superValidate(zod(formSchema)),
    // };
};