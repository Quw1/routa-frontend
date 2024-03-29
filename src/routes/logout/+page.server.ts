import { fetchPostAPI } from "$lib/utils.js.js";
import type { PageServerLoad, Actions, Action } from "./$types.js";
import { redirect } from "@sveltejs/kit";

export const load: PageServerLoad = async () => {
    // console.log('redirected without deleting');

    // throw redirect(302, '/')
}

const logout: Action = async ({ cookies }) => {
    try {
        const res = await fetchPostAPI('/auth/logout/', 'POST', '', cookies);
        cookies.delete('access_token', { path: '/' });
        cookies.delete('refresh_token', { path: '/' });
        // throw redirect(302, '/');  
    }
    catch (e) {
        console.log('ERRPR', e);
    }
}

export const actions: Actions = {
    default: logout,
}

