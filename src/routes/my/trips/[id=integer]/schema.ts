import { z } from "zod";

export const formSchema = z.object({
    location: z.string().min(2),
    place_id: z.string(),
});

export type FormSchema = typeof formSchema;