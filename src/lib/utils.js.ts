import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { cubicOut } from "svelte/easing";
import type { TransitionConfig } from "svelte/transition";
import { BackendURL } from "$lib";
import { object } from "zod";
import { redirect, type Cookies } from "@sveltejs/kit";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

type FlyAndScaleParams = {
    y?: number;
    x?: number;
    start?: number;
    duration?: number;
};

export const flyAndScale = (
    node: Element,
    params: FlyAndScaleParams = { y: -8, x: 0, start: 0.95, duration: 150 }
): TransitionConfig => {
    const style = getComputedStyle(node);
    const transform = style.transform === "none" ? "" : style.transform;

    const scaleConversion = (
        valueA: number,
        scaleA: [number, number],
        scaleB: [number, number]
    ) => {
        const [minA, maxA] = scaleA;
        const [minB, maxB] = scaleB;

        const percentage = (valueA - minA) / (maxA - minA);
        const valueB = percentage * (maxB - minB) + minB;

        return valueB;
    };

    const styleToString = (
        style: Record<string, number | string | undefined>
    ): string => {
        return Object.keys(style).reduce((str, key) => {
            if (style[key] === undefined) return str;
            return str + `${key}:${style[key]};`;
        }, "");
    };

    return {
        duration: params.duration ?? 200,
        delay: 0,
        css: (t) => {
            const y = scaleConversion(t, [0, 1], [params.y ?? 5, 0]);
            const x = scaleConversion(t, [0, 1], [params.x ?? 0, 0]);
            const scale = scaleConversion(t, [0, 1], [params.start ?? 0.95, 1]);

            return styleToString({
                transform: `${transform} translate3d(${x}px, ${y}px, 0) scale(${scale})`,
                opacity: t
            });
        },
        easing: cubicOut
    };
};

export const fetchPostAPI = async (url: string, method: string, data: string, cookies: Cookies): Promise<Response> => {

    const access_token = cookies.get('access_token');
    const refresh_token = cookies.get('refresh_token');
    if (!(access_token && refresh_token)) {
        throw "not_authorized";
    }

    let res: Response;
    if (method === "GET" || data === '') {
        res = await fetch(`${BackendURL}${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token,
            },
        });
    }
    else {
        res = await fetch(`${BackendURL}${url}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + access_token,
            },
            body: data,
        });
    }


    try {
        const responseData: object = await res.clone().json();
        if ('errors' in responseData) {
            // @ts-ignore
            if (responseData.errors.code === 'token_not_valid') {
                console.log('not valid')

                const resRefresh = await fetch(`${BackendURL}/auth/token/refresh/`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ refresh: refresh_token })
                });
                const responseRefreshData = await resRefresh.json();
                if ('access' in responseRefreshData) {
                    const newAccess = responseRefreshData['access'];
                    cookies.set('access_token', newAccess, {
                        path: '/',
                        httpOnly: true,
                        sameSite: 'strict',
                        secure: process.env.NODE_ENV === 'production',
                        maxAge: 60 * 60 * 24 * 30,
                    });
                    const q = cookies.getAll();
                    const newRes = await fetchPostAPI(url, method, data, cookies);
                    return newRes;
                }
                else {
                    cookies.delete('access_token', { path: '/' });
                    cookies.delete('refresh_token', { path: '/' });
                    return redirect(302, '/');
                }
            }
            //@ts-ignore
            console.log(responseData);
            
            throw "no_code_or_unexpected_code";
        }
        return res;
    }
    catch (e) {
        throw (e);
    }
}