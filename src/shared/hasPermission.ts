import { Role } from "@/modules/v1/role/role.schema";

export default function hasPermission(
  roles: Role[],
  permission: Role["permissions"][number]
) {
  return roles.some(({ permissions }) => permissions.includes(permission));
}
