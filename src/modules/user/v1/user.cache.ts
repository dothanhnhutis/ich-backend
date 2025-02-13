import { cache } from "@/shared/cache/connect";
import { QueryCacheError } from "@/shared/error-handler";
import logger from "@/shared/logger";
import { CreateSession, MFA, SessionData, User } from "./user.schema";
import { CACHE_TTL } from "@/shared/configs/constants";
import { randId } from "@/shared/helper";
import env from "@/shared/configs/env";
import { UAParser } from "ua-parser-js";
import { CookieOptions } from "express";
import { Role } from "@/modules/role/v1/role.schema";

const MFASessionName = "mfa:session";

export default class UserCache {
  static async getUserByEmail(email: string) {
    try {
      const id = await cache.get(`user:email:${email}`);
      if (!id) return null;
      const user = await cache.get(`user:${id}`);
      if (!user) return null;
      return JSON.parse(user) as User;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`UserCache.getUserByEmail() method error: ${error}`);
        throw new QueryCacheError(
          `UserCache.getUserByEmail() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getUserCacheById(id: string) {
    try {
      const user = await cache.get(`user:${id}`);
      return user == null ? null : (JSON.parse(user) as User);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.log(`UserCache.getUserCacheById() method error: `, error);
        throw new QueryCacheError(
          `UserCache.getUserCacheById() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async createUserCache(user: User) {
    try {
      await cache.set(`user:${user.id}`, JSON.stringify(user), "EX", CACHE_TTL);
      await cache.set(`user:email:${user.email}`, user.id, "EX", CACHE_TTL);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`UserCache.createUserCache() method error: `, error);
        throw new QueryCacheError(
          `UserCache.createUserCache() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async createSignInSession(
    userId: string,
    reqInfo: {
      ip: string;
      userAgentRaw: string;
    },
    cookie?: CookieOptions
  ) {
    const sessionId = await randId();
    const now = new Date();

    const cookieOpt = {
      path: "/",
      httpOnly: true,
      secure: env.NODE_ENV == "production",
      expires: new Date(now.getTime() + parseInt(env.SESSION_MAX_AGE)),
      ...cookie,
    };
    const sessionData: SessionData = {
      id: sessionId,
      userId,
      cookie: cookieOpt,
      reqInfo: {
        ...reqInfo,
        userAgent: UAParser(reqInfo.userAgentRaw),
        lastAccess: now,
        createAt: now,
      },
    };
    const key = `${env.SESSION_KEY_NAME}:${userId}:${sessionId}`;

    try {
      await cache.set(
        key,
        JSON.stringify(sessionData),
        "PX",
        cookieOpt.expires.getTime() - Date.now()
      );

      return {
        key,
        data: sessionData,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`UserCache.createSignInSession() method error: `, error);
        throw new QueryCacheError(
          `UserCache.createSignInSession() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async deleteSignInSession(userId: string, sessionId: string) {
    const key = `${env.SESSION_KEY_NAME}:${userId}:${sessionId}`;
    try {
      await cache.del(key);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`UserCache.deleteSignInSession() method error: `, error);
        throw new QueryCacheError(
          `UserCache.deleteSignInSession() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getSignInSessionByKey(key: string) {
    try {
      const session = await cache.get(key);
      if (!session) return null;
      return JSON.parse(session) as SessionData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`UserCache.getSignInSessionByKey() method error: `, error);
        throw new QueryCacheError(
          `UserCache.getSignInSessionByKey() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async refreshSessionByKey(key: string) {
    try {
      const session = await cache.get(key);
      if (!session) return null;
      const sessionData: SessionData = JSON.parse(session);
      const now = Date.now();
      const expires: Date = new Date(now + parseInt(env.SESSION_MAX_AGE));
      sessionData.reqInfo.lastAccess = new Date(now);
      sessionData.cookie.expires = expires;
      await cache.set(
        key,
        JSON.stringify(sessionData),
        "PX",
        expires.getTime() - Date.now()
      );

      return sessionData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`UserCache.refreshSessionByKey() method error: `, error);
        throw new QueryCacheError(
          `UserCache.refreshSessionByKey() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getMFA(userId: string) {
    try {
      const data = await cache.get(`mfa:${userId}`);
      if (!data) return null;
      return JSON.parse(data) as MFA;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`UserCache.getMFA() method error: `, error);
        throw new QueryCacheError(
          `UserCache.getMFA() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async createMFA(data: MFA) {
    try {
      await cache.set(
        `mfa:${data.userId}`,
        JSON.stringify(data),
        "EX",
        CACHE_TTL
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`UserCache.createMFA() method error: `, error);
        throw new QueryCacheError(
          `UserCache.createMFA() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async createMFASession(
    userId: string,
    secretKey: string,
    reqInfo: {
      ip: string;
      userAgentRaw: string;
    },
    cookie?: CookieOptions
  ) {
    try {
      const sessionId = await randId();
      const now = new Date();
      const cookieOpt = {
        path: "/",
        httpOnly: true,
        secure: env.NODE_ENV == "production",
        expires: new Date(now.getTime() + 30 * 60 * 1000),
        ...cookie,
      };

      const key = `${MFASessionName}:${userId}:${sessionId}`;
      const sessionData: SessionData = {
        id: sessionId,
        userId: userId,
        cookie: cookieOpt,
        reqInfo: {
          ...reqInfo,
          userAgent: UAParser(reqInfo.userAgentRaw),
          lastAccess: now,
          createAt: now,
        },
      };

      await cache.set(
        key,
        JSON.stringify({
          userId,
          secretKey,
        }),
        "PX",
        cookieOpt.expires.getTime() - Date.now()
      );

      return {
        key,
        data: sessionData,
      };
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log(`UserCache.createMFASession() method error: `, error);
        throw new QueryCacheError(
          `UserCache.createMFASession() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getSessionByKey(key: string) {
    try {
      const session = await cache.get(key);
      if (!session) return null;
      return JSON.parse(session) as SessionData;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`UserCache.getSessionByKey() method error: `, error);
        throw new QueryCacheError(
          `UserCache.getSessionByKey() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async deleteSessionByKey(key: string) {
    try {
      await cache.del(key);
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`UserCache.deleteSessionByKey() method error: `, error);
        throw new QueryCacheError(
          `UserCache.deleteSessionByKey() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getSessions(userId: string) {
    try {
      const keys = await cache.keys(`${env.SESSION_KEY_NAME}:${userId}:*`);
      const data: SessionData[] = [];
      for (const key of keys) {
        const session = await UserCache.getSessionByKey(key);
        if (!session) continue;
        data.push(session);
      }
      return data;
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`UserCache.getSessions() method error: `, error);
        throw new QueryCacheError(
          `UserCache.getSessions() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async createRolesOfUser(userId: string, roles: Role[]) {
    try {
      await cache.set(
        `user:${userId}:roles`,
        JSON.stringify(roles),
        "EX",
        CACHE_TTL
      );
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`UserCache.createRolesOfUser() method error: `, error);
        throw new QueryCacheError(
          `UserCache.createRolesOfUser() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getRolesOfUser(userId: string) {
    try {
      const roleCache = await cache.get(`user:${userId}:roles`);
      if (!roleCache) return null;
      return JSON.parse(roleCache) as Role[];
    } catch (error) {
      if (error instanceof Error) {
        logger.error(`UserCache.getRolesOfUser() method error: `, error);
        throw new QueryCacheError(
          `UserCache.getRolesOfUser() method error: ${error.message}`
        );
      }
      throw error;
    }
  }
}
