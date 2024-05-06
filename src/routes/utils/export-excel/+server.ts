import { BackendURL } from "$lib";
import { fetchPostAPI } from "$lib/utils.js";
import { json, type RequestHandler } from "@sveltejs/kit";


export const GET: RequestHandler = async ({url, cookies}) => {
    const loc = url.searchParams.get('trip');
    const res = await fetch(`${BackendURL}/trips/export-trip/${loc}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': 'Bearer ' + cookies.get('access_token'),
		},
		body: '',
	});
    if (await res.ok) {
        const bl = await res.blob();
        const file = new File([bl], "trip.xlx");
        return new Response(bl, { status: 200 })
    }

    else {
        return json({status: 'error'})
    }
	
    
};

