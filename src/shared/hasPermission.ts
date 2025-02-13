import { Role } from "@/modules/role/v1/role.schema";

export default function hasPermission(roles: Role[], permission: string) {
  return roles.some(({ permissions }) => permissions.includes(permission));
}
