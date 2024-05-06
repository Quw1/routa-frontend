import { z } from "zod";
 
export const formSchema = z.object({
  password: z.string().min(6).max(68),
});
 
export type FormSchema = typeof formSchema;