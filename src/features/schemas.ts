import { z } from "zod";

export const userSchema = z.object({
  email: z.string().email(),
  name: z.string().min(3),
  phone: z.string().min(10),
});
