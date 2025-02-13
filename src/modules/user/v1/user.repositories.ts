import prisma from "@/shared/db/connect";
import UserCache from "./user.cache";
import { MFA, User, UserAttributeFilterProps } from "./user.schema";

function userPublicAttr(user: UserAttributeFilterProps): User {
  const {
    emailVerificationExpires,
    emailVerificationToken,
    passwordResetExpires,
    passwordResetToken,
    reActiveExpires,
    reActiveToken,
    ...props
  } = user;

  return props;
}

export default class RoleRepositories {
  static async getUserByEmail(email: string, cache?: boolean) {
    if (cache ?? true) {
      const userCache = await UserCache.getUserByEmail(email);
      if (userCache) return userCache;
    }
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (user) {
      // const afterUser = userPublicAttr(user);
      if (cache ?? true) {
        await UserCache.createUserCache(user);
      }
      return user;
    }
    return user;
  }

  static async getUserById(id: string, cache?: boolean) {
    if (cache ?? true) {
      const userCache = await UserCache.getUserCacheById(id);
      if (userCache) return userCache;
    }
    const user = await prisma.user.findUnique({
      where: {
        id,
      },
    });
    if (user) {
      // const afterUser = userPublicAttr(user);
      if (cache ?? true) {
        await UserCache.createUserCache(user);
      }
      return user;
    }
    return user;
  }

  static async getMFa(userId: string): Promise<MFA | null> {
    const mfa = await prisma.mFA.findUnique({
      where: { userId },
    });
    if (!mfa) return null;

    return mfa;
  }

  static async getRoles(userId: string) {
    const userRoles = await prisma.userRole.findMany({
      where: {
        userId,
      },
    });
    const roleIds = userRoles.map((userRole) => userRole.roleId);

    const roles = await prisma.role.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },
    });

    return roles;
  }
}
