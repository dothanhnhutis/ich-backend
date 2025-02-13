import prisma from "@/shared/db/connect";
import { CreateRole, Role, UpdateRole } from "./role.schema";
import RoleCache from "./role.cache";

export default class RoleRepositories {
  static async getRoles() {
    const roles = await prisma.role.findMany();
    return roles;
  }

  static async getRoleById(roleId: string, cache?: boolean) {
    if (cache ?? true) {
      const roleCache = await RoleCache.getRoleById(roleId);
      if (roleCache) return roleCache;
    }

    const role = (await prisma.role.findUnique({
      where: { id: roleId },
    })) as Role | null;

    if (!role) return null;
    if (cache ?? true) {
      await RoleCache.storeRole(role);
    }

    return role;
  }

  static async createRole(data: CreateRole, storeCache?: boolean) {
    const role = (await prisma.role.create({
      data,
    })) as Role;

    if (storeCache ?? true) {
      await RoleCache.storeRole(role);
    }
    return role;
  }

  static async updateRoleById(
    roleId: string,
    data: UpdateRole,
    updateCache?: boolean
  ) {
    const role = (await prisma.role.update({
      where: {
        id: roleId,
      },
      data,
    })) as Role;
    if (updateCache ?? true) {
      await RoleCache.storeRole(role);
    }
    return role;
  }

  static async deleteRoleById(roleId: string, clearCache?: boolean) {
    const role = (await prisma.role.delete({
      where: {
        id: roleId,
      },
    })) as Role;
    if (clearCache) {
      await RoleCache.deleteRoleById(roleId);
    }
    return role;
  }
}
