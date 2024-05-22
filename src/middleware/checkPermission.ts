import { RequestHandler as Middleware } from "express";
import { PermissionError } from "../error-handler";
import { UserRole, UserCurrent } from "../schemas/user.schema";

const checkPermission =
  (roles: UserRole[]): Middleware =>
  (req, res, next) => {
    if (!req.user || !roles.includes((req.user as UserCurrent).role))
      throw new PermissionError();
    next();
  };
export default checkPermission;
