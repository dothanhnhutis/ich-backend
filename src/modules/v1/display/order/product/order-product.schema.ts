import * as z from "zod";
import { pro_unit } from "@/shared/configs/constants";

export const displayOrderProductSchema = z.object({
  prod_name: z.string({
    invalid_type_error: "Tên sản phẩm là chuỗi",
    required_error: "Tên sản phẩm là bắt buộc",
  }),
  image: z
    .string({
      invalid_type_error: "Hình phải là chuỗi",
      required_error: "Hình là bắt buộc",
    })
    .url("Đường dẫn hình không hợp lệ"),
  priority: z
    .number({
      invalid_type_error: "Mức độ ưu tiên phải là số nguyên",
      required_error: "Mức độ là ưu tiên bắt buộc",
    })
    .min(0, "Mức độ phải là số nguyên dương")
    .default(0),
  unit: z.enum(pro_unit, {
    invalid_type_error: "Đơn vị tính phải là 'CARTON', 'PACKAGED_GOODS'",
    required_error: "Đơn vị tính là bắt buộc",
  }),
  quantity: z
    .number({
      invalid_type_error: "Số lượng phải là số nguyên",
      required_error: "Số lượng là bắt buộc",
    })
    .min(0, "Số lượng phải là số nguyên dương"),
  pack_spec: z
    .number({
      invalid_type_error: "Quy cách phải là số nguyên",
      required_error: "Quy cách là bắt buộc",
    })
    .min(0, "Quy cách phải là số nguyên dương"),
  note: z.array(z.string()).default([]),
});

export const createDisplayOrderProductSchema = z.object({
  params: z
    .object({
      displayOrderId: z.string(),
    })
    .strip(),
  body: displayOrderProductSchema,
});

export const updateDisplayOrderProductSchema = z.object({
  params: z
    .object({
      displayOrderId: z.string(),
      productId: z.string(),
    })
    .strip(),
  body: displayOrderProductSchema.strip().partial(),
});

export type CreateDisplayOrderProductReq = z.infer<
  typeof createDisplayOrderProductSchema
>;
export type UpdateDisplayOrderProductReq = z.infer<
  typeof updateDisplayOrderProductSchema
>;
export type CreateDisplayOrderProduct = CreateDisplayOrderProductReq["body"];
export type UpdateDisplayOrderProduct = UpdateDisplayOrderProductReq["body"];
