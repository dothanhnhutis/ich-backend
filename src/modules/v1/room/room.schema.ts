import * as z from "zod";

export const createRoomSchema = z.object({
  body: z.object({
    room_name: z.string({
      required_error: "Tên phòng là trường bắt buộc",
      invalid_type_error: "Tên phòng phải là chuỗi",
    }),
    location_id: z.string({
      required_error: "Địa điểm là trường bắt buộc",
      invalid_type_error: "Địa điểm phải là chuỗi",
    }),
  }),
});

export const updateRoomSchema = z.object({
  params: z.object({
    roomId: z.string(),
  }),
  body: z
    .object({
      room_name: z.string({
        invalid_type_error: "Tên phòng phải là chuỗi",
      }),
      location_id: z.string({
        invalid_type_error: "Địa điểm phải là chuỗi",
      }),
    })
    .strip()
    .partial(),
});

export type CreateRoomReq = z.infer<typeof createRoomSchema>;
export type UpdateRoomReq = z.infer<typeof updateRoomSchema>;

export type CreateRoom = CreateRoomReq["body"];
export type UpdateRoom = UpdateRoomReq["body"];

export type Room = CreateRoom & {
  id: string;
  created_at: Date;
  updated_at: Date;
};
