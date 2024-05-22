import { RequestHandler as Middleware } from "express";
import { NotAuthorizedError, PermissionError } from "../error-handler";
import { CurrentUser } from "../schemas/user.schema";

export const requiredAuth: Middleware = (req, res, next) => {
  if (!req.isAuthenticated()) {
    throw new NotAuthorizedError();
  }
  if (!req.user || (req.user as CurrentUser).isBlocked) {
    throw new PermissionError();
  }
  next();
};
