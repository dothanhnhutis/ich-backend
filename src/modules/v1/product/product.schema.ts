import { pro_unit } from "@/shared/configs/constants";
import * as z from "zod";

export const createProductSchema = z.object({
  body: z.object({
    pro_name: z.string(),
    images: z.array(z.string().url()),
    quantity: z.number(),
    unit: z.enum(pro_unit),
    pack_spec: z.number(),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    productId: z.string(),
  }),
  body: z
    .object({
      pro_name: z.string(),
      images: z.array(z.string().url()),
      unit: z.enum(pro_unit),
      pack_spec: z.number(),
    })
    .strip()
    .partial(),
});

export type CreateProductReq = z.infer<typeof createProductSchema>;
export type UpdateProductReq = z.infer<typeof updateProductSchema>;

export type CreateProduct = CreateProductReq["body"];

export type Product = CreateProductReq["body"] & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
