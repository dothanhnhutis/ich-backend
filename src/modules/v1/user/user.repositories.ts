import prisma from "@/shared/db/connect";
import UserCache from "./user.cache";
import { MFA, User, UserAttributeFilterProps } from "./user.schema";
import { Role } from "@/modules/v1/role/role.schema";

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
      include: {
        user_roles: {
          select: {
            role: true,
          },
        },
      },
    });

    if (user) {
      // const afterUser = userPublicAttr(user);

      if (cache ?? true) {
        const { user_roles, ...u } = user;
        await UserCache.createUserCache(u);

        // can kiem tra lai co nen cache user:[userId]:roles
        await UserCache.createRolesOfUser(
          u.id,
          user_roles.map(({ role }) => role as Role)
        );
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

  static async getMFa(user_id: string): Promise<MFA | null> {
    const mfa = await prisma.mFA.findUnique({
      where: { user_id },
    });
    if (!mfa) return null;

    return mfa;
  }

  static async getRoles(user_id: string, cache?: boolean) {
    if (cache ?? true) {
      const roles = await UserCache.getRolesOfUser(user_id);
      if (roles) return roles;
    }

    const userRoles = await prisma.userRole.findMany({
      where: {
        user_id,
      },
    });

    const roleIds = userRoles.map((userRole) => userRole.role_id);

    const roles = (await prisma.role.findMany({
      where: {
        id: {
          in: roleIds,
        },
      },
    })) as Role[];

    if (roles && (cache ?? true)) {
      UserCache.createRolesOfUser(user_id, roles);
    }

    return roles;
  }
}
