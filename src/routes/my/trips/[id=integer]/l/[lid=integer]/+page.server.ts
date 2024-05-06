import type { Location } from '$lib/components/trips/location.ts';
import type { Place } from '$lib/components/trips/place.js';
import { fetchPostAPI } from '$lib/utils.js.js';
import { error, fail, redirect, type Action, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { number } from 'zod';
import { formSchema, placeEditFormSchema } from './schema';

export async function load({ params, cookies }) {
	try {
		const res = await fetchPostAPI(`/trips/places-for-location/${params.lid}`, 'GET', '', cookies);
		const resJson = await res.json();
		const places: Place[] = resJson.data.results;

        const resLocation = await fetchPostAPI(`/trips/location-by-id/${params.lid}`, 'GET', '', cookies);
        const resLocationJson = await resLocation.json();
		const location: Location = resLocationJson.data;
        
		return { places: places, form: await superValidate(zod(formSchema)), location: location, placeForm: await superValidate(zod(placeEditFormSchema))};


	}
	catch (e) {
		console.log(e);
		return redirect(302, '/login')
	}
}


const newPlace: Action = async (event) => {
	const form = await superValidate(event, zod(formSchema));
	if (!form.valid) {
        return fail(400, {
            form,
        });
    }
	let d = form.data;
	const sendData = {
		"name": d.place,
        "sort_id": 0,
        "visited": false,
	}
	const res = await fetchPostAPI(`/trips/places-for-location/${event.params.lid}`, 'POST', JSON.stringify(sendData), event.cookies)
	return message(form, 'Success');
}

const editPlace: Action = async (event) => {
    const d = await event.request.formData();
    const place_id = d.get('place_id');
    const res = await fetchPostAPI(`/trips/place-by-id/${place_id}`, 'DELETE', '', event.cookies)
}



export const actions: Actions = {
	new_location: newPlace,
    edit_place: editPlace,
};