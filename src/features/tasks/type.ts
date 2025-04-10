import { taskSchema } from "./schemas";
import { z } from "zod";

export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "1" | "2"; 
  due_date: string | null;
  category: string;
  category_id: string | null;
}

export interface Category {
  id: string;
  ar_name: string;
  en_name: string;
  name: string; 
}

export type UpdateTaskVariables = {
  id: string;
  data: z.infer<typeof taskSchema>;
};

export const statusMap = {
  "1": "pending",
  "2": "completed"
};