import * as z from "zod";

export const createRoomSchema = z.object({
  params: z
    .object({
      locationId: z.string(),
    })
    .strip(),
  body: z.object({
    room_name: z.string({
      required_error: "Tên phòng là trường bắt buộc",
      invalid_type_error: "Tên phòng phải là chuỗi",
    }),
  }),
});

export const updateRoomSchema = z.object({
  params: z
    .object({
      locationId: z.string(),
      roomId: z.string(),
    })
    .strip(),
  body: z
    .object({
      room_name: z.string({
        invalid_type_error: "Tên phòng phải là chuỗi",
      }),
    })
    .strip()
    .partial(),
});

export type CreateRoomReq = z.infer<typeof createRoomSchema>;
export type UpdateRoomReq = z.infer<typeof updateRoomSchema>;

export type CreateRoom = CreateRoomReq["body"] & {
  location_id: string;
};
export type UpdateRoom = UpdateRoomReq["body"];

export type Room = CreateRoom & {
  id: string;
  created_at: Date;
  updated_at: Date;
};
