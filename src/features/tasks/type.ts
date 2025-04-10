import { taskSchema } from "./schemas";
import { z } from "zod";


  export interface Task {
    id:string;
    promo_code: string;
    percentage: number;
  }
  


  export type UpdateTaskVariables = {
    id: string;
    data: z.infer<typeof taskSchema>;
  };
  

  