import { Role } from "@/modules/role/v1/role.schema";
import UserRepositories from "@/modules/user/v1/user.repositories";
import { User } from "@/modules/user/v1/user.schema";
import { RequestHandler as Middleware } from "express";

declare global {
  namespace Express {
    interface Request {
      user: User | null;
      roles: Role[];
    }
  }
}

const deserializeUser: Middleware = async (req, res, next) => {
  if (!req.sessionData) return next();
  req.user = await UserRepositories.getUserById(req.sessionData.userId);
  if (!req.user) {
    req.roles = [];
  } else {
    req.roles = await UserRepositories.getRoles(req.user.id);
  }
  next();
};
export default deserializeUser;
