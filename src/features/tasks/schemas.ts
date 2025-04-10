import { z } from "zod";


export const taskSchema = z.object({
  title: z
    .string()
    .min(1, { message: ("title required") })
    .max(255, { message: ("title shouldn't exceed 255 characters ") }),
  description: z
    .string()
    .nullable()
    .optional(),
  status: z.enum(["1", "2"], {
    errorMap: () => ({ message: ("status of task required ") }),
  }),
  due_date: z.string().nullable().optional(),
  category_id: z.string().nullable().optional(),
});