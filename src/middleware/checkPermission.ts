import { RequestHandler as Middleware } from "express";
import { Role } from "../validations/user.validations";
import { PermissionError } from "../error-handler";

const checkPermission =
  (roles: Role[]): Middleware =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role))
      throw new PermissionError();
    next();
  };
export default checkPermission;
