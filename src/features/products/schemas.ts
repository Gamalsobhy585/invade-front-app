import { z } from "zod";

export const addProductSchema = z.object({
  product: z.string().min(3, "Product Name Must ne atleast 3 Chars"),
  brand: z.string().min(1, "Required"),
  category: z.string().min(1, "Required"),
  price: z
    .number()
    .min(1, { message: "Price must be greater than 0" }),
  quantity: z
    .number()
    .min(1, { message: "Quantity must be greater than 0" }),
  shipping_description: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  image: z.any(),
  image_url: z.array(z.any()).optional(),
});

export const addBrandSchema = z.object({
  name: z.string().min(3, "Required"),
  image: z.any(),
});

export const addCategorySchema = z.object({
  name: z.string().min(1, "Required"),
  image: z.any().optional(),
});
