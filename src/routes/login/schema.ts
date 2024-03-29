import { z } from "zod";
 
export const formSchema = z.object({
  email: z
  .string()
  .min(3, { message: "This field has to be filled." })
  .email("This is not a valid email.")
  .max(255),
  password: z.string().min(6).max(68),
});
 
export type FormSchema = typeof formSchema;