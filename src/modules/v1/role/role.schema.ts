import { permissions } from "@/shared/configs/constants";
import * as z from "zod";

export const createRoleSchema = z.object({
  body: z.object({
    name: z.string({
      required_error: "Tên là trường bắt buộc",
      invalid_type_error: "Tên phải là chuỗi",
    }),
    permissions: z.array(
      z.enum(permissions, {
        message: `Quyền phải là ${permissions.join(", ")}`,
      }),
      {
        required_error: "Quyền là trường bắt buộc",
        invalid_type_error: "Quyền phải là mảng",
      }
    ),
  }),
});

export const updateRoleSchema = z.object({
  params: z.object({
    roleId: z.string(),
  }),
  body: z
    .object({
      name: z.string({
        required_error: "Tên là trường bắt buộc",
        invalid_type_error: "Tên phải là chuỗi",
      }),
      permissions: z.array(
        z.enum(permissions, {
          message: `Quyền phải là ${permissions.join(", ")}`,
        }),
        {
          required_error: "Quyền là trường bắt buộc",
          invalid_type_error: "Quyền phải là mảng",
        }
      ),
    })
    .strip()
    .partial(),
});

export type CreateRoleReq = z.infer<typeof createRoleSchema>;
export type UpdateRoleReq = z.infer<typeof updateRoleSchema>;

export type CreateRole = CreateRoleReq["body"];
export type UpdateRole = UpdateRoleReq["body"];

export type Role = CreateRoleReq["body"] & {
  id: string;
  created_at: Date;
  updated_at: Date;
};
