import * as z from "zod";

const displayOrderProductSchema = z
  .object({
    productName: z.string(),
    image: z.string().url(),
    unit: z.enum(["CARTON", "PACKAGED_GOODS"]),
    quantity: z.number(),
    pack_spec: z.number(),
  })
  .strict();

export const createDisplayOrderSchema = z.object({
  body: z.object({
    customerName: z.string({
      invalid_type_error: "Tên khách hàng phải là chuỗi",
      required_error: "Tên khách hàng là bắt buộc",
    }),
    priority: z
      .number({
        invalid_type_error: "Mức độ phải là số nguyên",
        required_error: "Mức độ là bắt buộc",
      })
      .min(0, "Mức độ phải là số nguyên dương")
      .default(0),
    status: z
      .enum(["TO_DO", "ON_PROGRESS", "COMPLETED"], {
        invalid_type_error: `Trạng thái phải là `,
      })
      .default("TO_DO"),
    products: z.array(displayOrderProductSchema),
    address: z.string({}).optional(),
    phoneNumber: z.string({}).optional(),
    roomIds: z.array(z.string({})),
  }),
});

export type CreateDisplayOrderReq = z.infer<typeof createDisplayOrderSchema>;

export type CreateDisplayOrder = CreateDisplayOrderReq["body"];

export type DisplayOrder = CreateDisplayOrder & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
