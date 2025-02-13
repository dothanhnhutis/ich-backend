import { BadRequestError } from "@/shared/error-handler";
import RoleRepositories from "./role.repositories";
import { CreateRole, UpdateRole } from "./role.schema";

export default class RoleServices {
  static async getRoles() {
    return await RoleRepositories.getRoles();
  }

  static async getRoleById(roleId: string) {
    const role = await RoleRepositories.getRoleById(roleId);
    if (!role) throw new BadRequestError("Vai trò không tồn tại");
    return role;
  }

  static async createNewRole(data: CreateRole) {
    return await RoleRepositories.createRole(data);
  }

  static async updateRoleById(roleId: string, data: UpdateRole) {
    const role = await RoleRepositories.getRoleById(roleId);
    if (!role) throw new BadRequestError("Vai trò không tồn tại");

    return await RoleRepositories.updateRoleById(roleId, data);
  }

  static async deleteRoleById(roleId: string) {
    const role = await RoleRepositories.getRoleById(roleId);
    if (!role) throw new BadRequestError("Vai trò không tồn tại");
    return await RoleRepositories.deleteRoleById(roleId);
  }
}
