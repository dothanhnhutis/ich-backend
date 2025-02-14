import { Request } from "express";
import { SignInReq } from "./user.schema";
import { BadRequestError } from "@/shared/error-handler";
import { compareData } from "@/shared/password";
import UserRepositories from "./user.repositories";
import UserCache from "./user.cache";
import env from "@/shared/configs/env";

export default class UserServices {
  static async signIn(req: Request<{}, {}, SignInReq["body"]>) {
    const { email, password } = req.body;
    const user = await UserRepositories.getUserByEmail(email);
    if (
      !user ||
      !user.passwordHash ||
      !(await compareData(user.passwordHash, password))
    )
      throw new BadRequestError("Email và mật khẩu không hợp lệ.");

    if (user.status == "SUSPENDED")
      throw new BadRequestError(
        "Tài khoản của bạn đã tạm vô hiệu hoá. Vui lòng kích hoạt lại trước khi đăng nhập"
      );

    if (user.status == "LOCKED")
      throw new BadRequestError("Tài khoản của bạn đã vô hiệu hoá vĩnh viễn");

    const mfa = await UserRepositories.getMFa(user.id);
    if (mfa) {
      const session = await UserCache.createMFASession(user.id, mfa.secretKey, {
        ip: req.ip || "",
        userAgentRaw: req.headers["user-agent"] || "",
      });
      return { message: "Cần xác thực đa yếu tố (MFA)", session };
    } else {
      const session = await UserCache.createSignInSession(user.id, {
        ip: req.ip || "",
        userAgentRaw: req.headers["user-agent"] || "",
      });
      return { message: "Đăng nhập thành công", session };
    }
  }

  static async getSessions(userId: string) {
    return UserCache.getSessions(userId);
  }

  static async deleteSession(
    userId: string,
    sessionId: string,
    currentSession: string
  ) {
    const key = `${env.SESSION_KEY_NAME}:${userId}:${sessionId}`;
    const session = await UserCache.getSessionByKey(key);

    if (!session || session.userId != userId)
      throw new BadRequestError("Phiên không tồn tại");

    if (session.id == currentSession)
      throw new BadRequestError("Không thể xoá phiên hiện tại");

    await UserCache.deleteSessionByKey(key);
  }

  static async signOut(userId: string, sessionId: string) {
    await UserCache.deleteSignInSession(userId, sessionId);
  }

  static async getRoles(userId: string) {
    return await UserRepositories.getRoles(userId);
  }
}
