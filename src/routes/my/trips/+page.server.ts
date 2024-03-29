import type { PageServerLoad, Actions, Action } from "./$types.js";
import { fetchPostAPI } from "$lib/utils.js";
import { redirect } from "@sveltejs/kit";
import type { Trip } from "$lib/components/trips/trip.js";


export const load: PageServerLoad = async ({cookies}) => {

    try {
            const res = await fetchPostAPI('/trips/?page=1', 'GET', '', cookies)
            const data = await res.json();
            console.log(typeof data.data.results[0]);
            

            const trips: Trip[] = [];
            data.data.results.forEach((dataTrip: Trip) => {
                trips.push(dataTrip);
            });

            return {trips: trips}
        
            
    }
    catch (e) {
        return redirect(302, '/login')
    }

    // return {
    //   form: await superValidate(zod(formSchema)),
    // };
};