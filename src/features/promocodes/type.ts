import { promocodeSchema } from "./schemas";
import { z } from "zod";


  export interface Promocode {
    id:string;
    promo_code: string;
    percentage: number;
  }
  


  export type UpdatePromocodeVariables = {
    id: string;
    data: z.infer<typeof promocodeSchema>;
  };
  

  