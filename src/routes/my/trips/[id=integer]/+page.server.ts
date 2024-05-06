import type { Trip } from '$lib/components/trips/trip.js';
import { fetchPostAPI } from '$lib/utils.js.js';
import { error, fail, redirect, type Action, type Actions } from '@sveltejs/kit';
import { message, superValidate } from 'sveltekit-superforms';
import { zod } from 'sveltekit-superforms/adapters';
import { number } from 'zod';
import { formSchema } from './schema';
import { BackendURL } from '$lib';

export async function load({ params, cookies }) {
	try {
		const res = await fetchPostAPI(`/trips/${params.id}`, 'GET', '', cookies)
		const resJson = await res.json();
		const trip: Trip = resJson.data;
		
		const resLocations = await fetchPostAPI(`/trips/locations-for-trip/${params.id}`, 'GET', '', cookies)
		const resLocationsJson = await resLocations.json();
		const locations = resLocationsJson.data.results;

		const resStats = await fetchPostAPI(`/stats/single-trip-summary/${params.id}`, 'GET', '', cookies)
		const resStatsJson = await resStats.json();
		const stats = resStatsJson.data;
		

		return { trip: trip, form: await superValidate(zod(formSchema)), locations: locations, stats: stats };


	}
	catch (e) {
		console.log(e);
		throw redirect(302, '/login')
	}
}


const newLocation: Action = async (event) => {
	const form = await superValidate(event, zod(formSchema));
	if (!form.valid) {
        return fail(400, {
            form,
        });
    }
	let d = form.data;

	const sendData = {
		"name": d.location,
		"place_id": d.place_id
	}
	const res = await fetchPostAPI(`/trips/locations-for-trip/${event.params.id}`, 'POST', JSON.stringify(sendData), event.cookies)
	return message(form, 'Success');
}

const editLocation: Action = async (event) => {
    const d = await event.request.formData();
    const location_id = d.get('location_id');
    const res = await fetchPostAPI(`/trips/location-by-id/${location_id}`, 'DELETE', '', event.cookies)
}


export const actions: Actions = {
	new_location: newLocation,
	edit_location: editLocation
};