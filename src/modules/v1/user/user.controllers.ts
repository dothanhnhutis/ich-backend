import { Request, Response } from "express";
import { SignInReq } from "./user.schema";
import { StatusCodes } from "http-status-codes";
import env from "@/shared/configs/env";
import { encrypt } from "@/shared/helper";
import UserServices from "./user.services";

export default class UserControllers {
  static async getSessions(req: Request, res: Response) {
    const { id } = req.user!;
    const sessions = await UserServices.getSessions(id);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "",
      data: sessions,
    });
  }

  static async getRoles(req: Request, res: Response) {
    const { id } = req.user!;
    const roles = await UserServices.getRoles(id);
    res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "",
      data: roles,
    });
  }

  static async deleteSessionById(
    req: Request<{ sessionId: string }>,
    res: Response
  ) {
    const { id: userId } = req.user!;
    const { id: currentSession } = req.sessionData!;

    await UserServices.deleteSession(
      userId,
      req.params.sessionId,
      currentSession
    );

    res.status(StatusCodes.OK).json({
      message: "Xoá phiên thành công",
    });
  }

  static async signIn(req: Request<{}, {}, SignInReq["body"]>, res: Response) {
    const { message, session } = await UserServices.signIn(req);
    return res
      .status(StatusCodes.OK)
      .cookie(env.SESSION_KEY_NAME, encrypt(session.key), {
        ...session.data.cookie,
      })
      .json({
        status: StatusCodes.OK,
        success: true,
        message: message,
        data: null,
      });
  }

  static async currentUser(req: Request, res: Response) {
    const { password_hash, ...noPass } = req.user!;

    return res.status(StatusCodes.OK).json({
      status: StatusCodes.OK,
      success: true,
      message: "",
      data: {
        ...noPass,
        has_password: !!password_hash,
        roles: req.roles,
        session: req.sessionData,
      },
    });
  }

  static async signOut(req: Request, res: Response) {
    if (req.sessionData)
      await UserServices.signOut(req.sessionData.user_id, req.sessionData.id);
    res
      .status(StatusCodes.OK)
      .clearCookie(env.SESSION_KEY_NAME)
      .json({
        status: StatusCodes.OK,
        success: true,
        message: "Đăng xuất thành công",
        data: null,
      })
      .end();
  }
}
