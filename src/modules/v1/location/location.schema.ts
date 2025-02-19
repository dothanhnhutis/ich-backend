import * as z from "zod";

export const createLocationSchema = z.object({
  body: z
    .object({
      location_name: z.string({
        required_error: "Tên là trường bắt buộc",
        invalid_type_error: "Tên phải là chuỗi",
      }),
      address: z.string({
        required_error: "Địa chỉ là trường bắt buộc",
        invalid_type_error: "Địa chỉ phải là chuỗi",
      }),
      location_type: z.enum(["Factory", "Warehouse"], {
        required_error: "Loại địa điểm là trường bắt buộc",
        invalid_type_error: "Loại địa điểm phải là 'Factory' hoặc 'Warehouse'",
      }),
      room_names: z
        .array(
          z.string({
            invalid_type_error: "Phần tử tên phòng trong mảng phải là chuỗi",
          }),
          {
            invalid_type_error: "Tên phòng phải là mảng chuỗi",
          }
        )
        .default([]),
    })
    .strict(),
});

export const updateLocationSchema = z.object({
  params: z.object({
    locationId: z.string(),
  }),
  body: z
    .object({
      location_name: z.string({
        invalid_type_error: "Tên phải là chuỗi",
      }),
      address: z.string({ invalid_type_error: "Địa chỉ phải là chuỗi" }),
      location_type: z.enum(["Factory", "Warehouse"], {
        invalid_type_error: "Loại địa điểm phải là 'Factory' hoặc 'Warehouse'",
      }),
      rooms: z
        .array(
          z.union(
            [
              z.object({
                room_id: z.string({}),
                room_name: z.string({
                  invalid_type_error:
                    "Phần tử tên phòng trong mảng phải là chuỗi",
                }),
              }),
              z.object({
                room_name: z.string({
                  invalid_type_error:
                    "Phần tử tên phòng trong mảng phải là chuỗi",
                }),
              }),
              z.object({
                room_id: z.string({
                  invalid_type_error:
                    "Phần tử tên phòng trong mảng phải là chuỗi",
                }),
              }),
            ],
            {
              errorMap: (issue, ctx) => {
                if (issue.code == "invalid_union") {
                  return {
                    message:
                      "Phần tử phòng phải là object, Hint: {room_id: string;room_name: string;} | {room_id: string;} | {room_name: string;}",
                  };
                }

                return { message: "123123" };
              },
            }
          ),
          {
            invalid_type_error:
              "Phòng phải là mảng object, Hint: Array<{room_id: string;room_name: string;} | {room_id: string;} | {room_name: string;}>",
          }
        )
        .default([]),
    })
    .strip()
    .partial(),
});

export type CreateLocationReq = z.infer<typeof createLocationSchema>;
export type UpdateLocationReq = z.infer<typeof updateLocationSchema>;

export type CreateLocation = CreateLocationReq["body"];
export type UpdateLocation = UpdateLocationReq["body"];

export type Location = Omit<CreateLocationReq["body"], "room_names"> & {
  id: string;
  created_at: Date;
  updated_at: Date;
};

export type Room = {
  id: string;
  room_name: string;
  location_id: string;
  created_at: Date;
  updated_at: Date;
};

export type StoreLocationCache = Omit<
  CreateLocationReq["body"],
  "room_names"
> & {
  id: string;
  created_at: Date;
  updated_at: Date;
  rooms: Room[];
};
