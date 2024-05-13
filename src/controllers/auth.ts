import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/db";
import { BadRequestError } from "../error-handler";
import { signJWT, verifyJWT } from "../utils/jwt";
import { generateOTPCode, hashData } from "../utils/helper";
import { SendOTP, SignUp } from "../schemas/user.schema";
import configs from "../configs";
import { pick } from "lodash";
import { sendMail } from "../utils/nodemailer";

export default class AuthController {
  async sendOtp(req: Request<{}, {}, SendOTP["body"]>, res: Response) {
    const { email } = req.body;
    const user = await prisma.user.findUnique({
      where: { email: email },
    });
    if (user) throw new BadRequestError("User already exists");
    const otp = await prisma.otp.findFirst({
      where: {
        email,
        verified: false,
        AND: [
          { expireAt: { gte: new Date(Date.now()) } },
          { expireAt: { lte: new Date(Date.now() + 1000 * 60 * 5) } },
        ],
      },
    });

    let code = otp
      ? verifyJWT<string>(otp.code, configs.JWT_SECRET)!
      : generateOTPCode();

    const data = {
      from: 'I.C.H Verify Email" <gaconght@gmail.com>',
      to: email,
      subject: "I.C.H Verify Email",
      html: `<b>code: ${code}</b>`,
    };

    if (!otp) {
      await prisma.otp.create({
        data: {
          email,
          code: signJWT(code, configs.JWT_SECRET),
          expireAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
        },
      });
    }

    const isSend = await sendMail("verifyEmail", email, {
      appIcon: "",
      appLink: "",
      verifyLink: "http://localhost:3000",
    });
    if (!isSend) throw new BadRequestError("Send email fail");

    return res.send({
      message: "Send email success",
    });
  }

  async signUp(req: Request<{}, {}, SignUp["body"]>, res: Response) {
    const { email, password, code, username } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) throw new BadRequestError("User already exists");
    const otp = await prisma.otp.findFirst({
      where: {
        verified: false,
        email,
        AND: [
          { expireAt: { gte: new Date(Date.now()) } },
          { expireAt: { lte: new Date(Date.now() + 1000 * 60 * 5) } },
        ],
      },
    });
    if (!otp || code != verifyJWT<string>(otp.code, configs.JWT_SECRET))
      throw new BadRequestError("Email verification code has expired");

    const hash = hashData(password);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hash,
        username,
      },
    });
    await prisma.otp.update({
      where: { id: otp.id },
      data: {
        verified: true,
      },
    });
    return res.send({
      message: "Sign up success",
      user: pick(newUser, ["id", "email", "role", "isBlocked"]),
    });
  }

  async signIn(req: Request, res: Response) {
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
