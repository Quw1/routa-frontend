import type { PageServerLoad, Actions, Action } from "./$types.js";
import { fetchPostAPI } from "$lib/utils.js";
import { fail, redirect } from "@sveltejs/kit";
import type { Trip } from "$lib/components/trips/trip.js";


export const load: PageServerLoad = async ({cookies}) => {

    try {
            const res = await fetchPostAPI('/trips/?page=1', 'GET', '', cookies)
            const data = await res.json();

            const resStats = await fetchPostAPI('/stats/all-trip-summary', 'GET', '', cookies)
            const dataStats = await resStats.json();
            

            const trips: Trip[] = [];
            data.data.results.forEach((dataTrip: Trip) => {
                trips.push(dataTrip);
            });
            console.log(dataStats.data);
            return {trips: trips, stats: dataStats.data}
        
            
    }
    catch (e) {
        return redirect(302, '/login')
    }

    // return {
    //   form: await superValidate(zod(formSchema)),
    // };
};

const editTrip: Action = async (event) => {
  console.log(1);
    const d = await event.request.formData();
    const trip_id = d.get('trip_id');
    const res = await fetchPostAPI(`/trips/${trip_id}`, 'DELETE', '', event.cookies)
}

export const actions: Actions = {
    upload: async ({ request, cookies }) => {
        const formData = Object.fromEntries(await request.formData());
     
        if (
          !(formData.excel as File).name ||
          (formData.excel as File).name === 'undefined'
        ) {
          return fail(400, {
            error: true,
            no_file: true,
          });
        }
     
        const { excel } = formData as { excel: File };
        const splitName = excel.name.split('.');
        console.log(splitName[splitName.length - 1]);
        
        if (splitName[splitName.length - 1] != 'xls' && splitName[splitName.length - 1] != "xlsx") {
          console.log(11);
          
          return fail(400, {
            error: true,
            not_excel: true,
          });
        }
        
        
        const blobToFile = (theBlob: Blob, fileName:string): File => {
          const b: any = theBlob;
          //A Blob() is almost a File() - it's just missing the two properties below which we will add
          b.lastModifiedDate = new Date();
          b.name = fileName;
            
          //Cast to a File() type
          return theBlob as File;
        }
        // const file1 = blobToFile(excel, 'file.xls');
        const file2 = new File([excel], "name");
        console.log(file2);

        let formDataNew = new FormData();
        formDataNew.append('file', file2);
        console.log(formDataNew);
        const res = await fetchPostAPI('/trips/import-trip', 'POST', formDataNew, cookies, 'multipart/form-data');
        console.log(await res.json());
        return { success: true };
      },
  edit_trip: editTrip
};