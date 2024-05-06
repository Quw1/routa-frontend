import { fetchPostAPI } from "$lib/utils.js";
import { json, type RequestHandler } from "@sveltejs/kit";


export const POST: RequestHandler = async (body) => {
    console.log(body);
    // const res = await fetchPostAPI()
    return json({
        data: "ss"
    })
};