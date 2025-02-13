import * as z from "zod";

export const createLocationSchema = z.object({
  body: z
    .object({
      name: z.string({
        required_error: "Tên là trường bắt buộc",
        invalid_type_error: "Tên phải là chuỗi",
      }),
      address: z.string({
        required_error: "Địa chỉ là trường bắt buộc",
        invalid_type_error: "Địa chỉ phải là chuỗi",
      }),
      locationType: z.enum(["Factory", "Warehouse"], {
        required_error: "Loại địa điểm là trường bắt buộc",
        invalid_type_error: "Loại địa điểm phải là 'Factory' hoặc 'Warehouse'",
      }),
    })
    .strict(),
});

export const updateLocationSchema = z.object({
  params: z.object({
    locationId: z.string(),
  }),
  body: z
    .object({
      name: z.string({
        invalid_type_error: "Tên phải là chuỗi",
      }),
      address: z.string({ invalid_type_error: "Địa chỉ phải là chuỗi" }),
      locationType: z.enum(["Factory", "Warehouse"], {
        invalid_type_error: "Loại địa điểm phải là 'Factory' hoặc 'Warehouse'",
      }),
    })
    .strip()
    .partial(),
});

export type CreateLocationReq = z.infer<typeof createLocationSchema>;
export type UpdateLocationReq = z.infer<typeof updateLocationSchema>;

export type CreateLocation = CreateLocationReq["body"];
export type UpdateLocation = UpdateLocationReq["body"];

export type Location = CreateLocationReq["body"] & {
  id: string;
  createdAt: Date;
  updatedAt: Date;
};
