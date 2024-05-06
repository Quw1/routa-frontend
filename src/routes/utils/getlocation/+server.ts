import { fetchPostAPI } from "$lib/utils.js";
import { json, type RequestHandler } from "@sveltejs/kit";
import { GOOGLE_API_KEY } from '$env/static/private'

export const GET: RequestHandler = async ({url, cookies}) => {
    const loc = url.searchParams.get('input');
    console.log(loc);
    const res = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${loc}&types=(cities)&key=${GOOGLE_API_KEY}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    });
    return json({
        data: await res.json()
    })
};