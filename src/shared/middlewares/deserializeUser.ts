import { Role } from "@/modules/v1/role/role.schema";
import UserRepositories from "@/modules/v1/user/user.repositories";
import { User } from "@/modules/v1/user/user.schema";
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
  req.user = await UserRepositories.getUserById(req.sessionData.user_id);
  if (!req.user) {
    req.roles = [];
  } else {
    req.roles = await UserRepositories.getRoles(req.user.id);
  }
  next();
};
export default deserializeUser;
