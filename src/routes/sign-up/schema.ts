import { z } from "zod";
 
export const formSchema = z.object({
  username: z.string().min(2).max(50).regex(/^[a-zA-Z0-9]+$/),
  email: z
  .string()
  .min(3, { message: "This field has to be filled." })
  .email("This is not a valid email.")
  .max(255),
  password: z.string().min(6).max(68),
});
 
export type FormSchema = typeof formSchema;