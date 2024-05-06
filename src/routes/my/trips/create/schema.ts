import { z } from "zod";
 
export const formSchema = z.object({
  name: z.string().min(2).max(50),
  start_date: z.string(),
});
 
export type FormSchema = typeof formSchema;