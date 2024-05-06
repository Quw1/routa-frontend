import { BackendURL } from "$lib";
import { fetchPostAPI } from "$lib/utils.js.js";
import { json, redirect, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({cookies, locals}) => {
        const res = await fetch(`${BackendURL}/auth/logout/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + cookies.get('access_token'),
            },
            body: '',
        });
        cookies.delete('access_token', { path: '/' });
        cookies.delete('refresh_token', { path: '/' });
        // locals.user = undefined;
        return json({ status: 200 });
};