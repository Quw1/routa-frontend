import { BackendURL } from '$lib';
import { redirect } from '@sveltejs/kit';
import { setError } from 'sveltekit-superforms';

export async function load({ params, url }) {
    let token = url.searchParams.get('token');
    if (token == "" || token == null || token === undefined) {
      throw redirect(302, "/")
    }
    try {
        const res = await fetch(`${BackendURL}/auth/email-verify/?token=${token}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
  
        if (res.ok) {
            const responseData = await res.json();
            console.log(responseData);
            return {status: "OK"};
        } else {
          const responseData = await res.json();
          console.log(responseData);
          const status = responseData.status;
          if (status === 'INV') {
            const textStatus = 'Token is invalid';
            return {status: "INV" };
          } else if (status === 'EXP') {
            const textStatus = 'Token is invalid';
            return { status: "INV" };
          } else {
              throw new Error(status);
          }
          
  
        }
    } catch (error) {
      throw new Error(String(error));
    }
}
