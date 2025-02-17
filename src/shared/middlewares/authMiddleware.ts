import { RequestHandler as Middleware } from "express";
import { NotAuthorizedError, PermissionError } from "../error-handler";

type TAuthMiddleware = {
  emailVerified: boolean;
};

export const authMiddleware =
  (props?: Partial<TAuthMiddleware>): Middleware =>
  async (req, _, next) => {
    if (!req.user) {
      throw new NotAuthorizedError();
    }
    const newProps: TAuthMiddleware = {
      emailVerified: true,
      ...props,
    };

    if (newProps.emailVerified && !req.user.email_verified) {
      throw new PermissionError("Tài khoản của bạn chưa xác thực");
    }

    if (req.user.status == "SUSPENDED") {
      throw new PermissionError("Tài khoản của bạn vị vô hiệu hoá tạm thời");
    }
    if (req.user.status == "LOCKED") {
      throw new PermissionError(
        "Tài khoản của bạn vị vô hiệu hoá tạm thời vĩnh viễn"
      );
    }
    return next();
  };
