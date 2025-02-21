import { pro_unit } from "@/shared/configs/constants";
import * as z from "zod";
import { displayOrderProductSchema } from "./product/order-product.schema";

export const createDisplayOrderSchema = z.object({
  body: z.object({
    cus_name: z.string({
      invalid_type_error: "Tên khách hàng phải là chuỗi",
      required_error: "Tên khách hàng là bắt buộc",
    }),
    priority: z
      .number({
        invalid_type_error: "Mức độ ưu tiên phải là số nguyên",
        required_error: "Mức độ ưu tiên là bắt buộc",
      })
      .min(0, "Mức độ phải là số nguyên dương")
      .default(0),
    status: z
      .enum(["TO_DO", "ON_PROGRESS", "COMPLETED"], {
        invalid_type_error: `Trạng thái phải là 'TO_DO', 'ON_PROGRESS', 'COMPLETED'`,
      })
      .default("TO_DO"),
    products: z.array(displayOrderProductSchema, {
      invalid_type_error: "Danh sách sản phẩm phải là số object",
      required_error: "Danh sách sản phẩm là bắt buộc",
    }),
    address: z
      .string({
        invalid_type_error: "Địa chỉ phải là số nguyên",
      })
      .optional()
      .default(""),
    phone_number: z
      .string({
        invalid_type_error: "Số điện thoại phải là số nguyên",
      })
      .optional()
      .default(""),
    room_ids: z.array(
      z.string({
        invalid_type_error: "Các phần tử trong mãng phải là chuỗi",
      }),
      {
        invalid_type_error: "Mã phòng phải là mãng",
        required_error: "Mã phòng là bắt buộc",
      }
    ),
    note: z.array(z.string()).default([]),
  }),
});

export type CreateDisplayOrderReq = z.infer<typeof createDisplayOrderSchema>;

export type CreateDisplayOrder = CreateDisplayOrderReq["body"];

export type DisplayOrder = Omit<CreateDisplayOrder, "products" | "room_ids"> & {
  id: string;
  created_at: Date;
  updated_at: Date;
};

export type DisplayOrderProduct = z.infer<typeof displayOrderProductSchema> & {
  id: string;
  display_order_id: string;
  created_at: Date;
  updated_at: Date;
};
