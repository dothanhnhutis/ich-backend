import * as z from "zod";

export const createProductSchema = z.object({
  body: z.object({
    prod_name: z.string({
      invalid_type_error: "Tên sản phẩm phải là chuỗi",
      required_error: "Tên sản phẩm là bắt buộc",
    }),
    images: z.array(z.string().url("Hình sản phẩm phải là url"), {
      invalid_type_error: "Hình sản phẩm phải là mảng url",
      required_error: "Hình sản phẩm là bắt buộc",
    }),
    pack_spec: z
      .number({
        invalid_type_error: "Quy cách là số nguyên",
      })
      .min(0, "Quy cách là số nguyên dương")
      .default(0),
  }),
});

export const updateProductSchema = z.object({
  params: z.object({
    productId: z.string(),
  }),
  body: z
    .object({
      prod_name: z.string({
        invalid_type_error: "Tên sản phẩm phải là chuỗi",
      }),
      images: z.array(z.string().url("Hình sản phẩm phải là url"), {
        invalid_type_error: "Hình sản phẩm phải là mảng url",
      }),
      pack_spec: z
        .number({
          invalid_type_error: "Quy cách là số nguyên",
        })
        .min(0, "Quy cách là số nguyên dương")
        .default(0),
    })
    .strip()
    .partial(),
});

export type CreateProductReq = z.infer<typeof createProductSchema>;
export type UpdateProductReq = z.infer<typeof updateProductSchema>;

export type CreateProduct = CreateProductReq["body"];
export type UpdateProduct = UpdateProductReq["body"];

export type Product = CreateProductReq["body"] & {
  id: string;
  created_at: Date;
  updated_at: Date;
};
