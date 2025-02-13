import { cache } from "@/shared/cache/connect";
import { Role } from "./role.schema";
import { CACHE_TTL } from "@/shared/configs/constants";
import logger from "@/shared/logger";
import { QueryCacheError } from "@/shared/error-handler";

export default class RoleCache {
  static async getRoleById(roleId: string) {
    try {
      const role = await cache.get(`role:${roleId}`);
      if (!role) return null;
      return JSON.parse(role) as Role;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`RoleCache.getRoleById() method error: `, error);
        throw new QueryCacheError(
          `RoleCache.getRoleById() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async storeRole(role: Role) {
    try {
      await cache.set(`role:${role.id}`, JSON.stringify(role), "EX", CACHE_TTL);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`RoleCache.storeRole() method error: `, error);
        throw new QueryCacheError(
          `RoleCache.storeRole() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async deleteRoleById(roleId: string) {
    try {
      await cache.del(`role:${roleId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`RoleCache.deleteRoleById() method error: `, error);
        throw new QueryCacheError(
          `RoleCache.deleteRoleById() method error: ${error.message}`
        );
      }
      throw error;
    }
  }
}
