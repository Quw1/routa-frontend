import { z } from "zod";

export const formSchema = z.object({
    place: z.string().min(2),
});

export const placeEditFormSchema = z.object({
    place: z.boolean().default(false)
});


export type FormSchema = typeof formSchema;