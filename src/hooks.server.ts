import { BackendURL } from "$lib";
import { fetchPostAPI } from "$lib/utils.js";
import type { Handle } from "@sveltejs/kit";

export const handle: Handle = async ({ event, resolve }) => {
    const access_token = event.cookies.get('access_token');
    if (access_token) {
        const res = await fetchPostAPI('/auth/get-me/', 'GET', '', event.cookies);
        const resdata = await res.json();
        console.log(resdata);
        if ('data' in resdata) {
          event.locals.user = {
            email: resdata.data.email,
            username: resdata.data.username
          }
        }
        
    }
    
    return await resolve(event);
}