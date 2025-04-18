import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
});


export const registerSchema=z.object({
  name:z.string().min(3,"Name must be at least 3 characters"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters",
  }),
  password_confirmation: z.string().min(6),
}).refine((data) => data.password === data.password_confirmation, {
  message: "Passwords don't match",
  path: ["password_confirmation"],
})