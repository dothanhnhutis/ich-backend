import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

export default class AuthController {
  async signIn(req: Request, res: Response) {
    console.log(123);
    res.status(StatusCodes.OK).json({
      message: "Signin successful",
      user: req.user,
    });
  }

  async signOut(req: Request, res: Response) {
    req.logout(function (err) {
      if (err) throw err;
    });
    res.clearCookie("session");
    res.status(StatusCodes.OK).json({
      message: "Signout successful",
    });
  }
}
