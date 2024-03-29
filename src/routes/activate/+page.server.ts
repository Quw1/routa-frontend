import { BackendURL } from '$lib';
import { setError } from 'sveltekit-superforms';

export async function load({ params, url }) {
    let token = url.searchParams.get('token');
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
            return true;
        } else {
          const responseData = await res.json();
          console.log(responseData);
          const status = responseData.status;
          if (status === 'INV') {
            const textStatus = 'Token is invalid';
            return {textStatus };
          } else if (status === 'EXP') {
            const textStatus = 'Token is invalid';
            return { textStatus };
          } else {
              throw new Error(status);
          }
          
  
        }
    } catch (error) {
      throw new Error(String(error));
    }
}
