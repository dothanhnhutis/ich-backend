import crypto from "crypto";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/db";
import { BadRequestError } from "../error-handler";
import { signJWT, verifyJWT } from "../utils/jwt";
import { generateOTPCode, hashData } from "../utils/helper";
import {
  ResetPassword,
  SendOTPAndRecoverEmail,
  SignUp,
} from "../schemas/user.schema";
import configs from "../configs";
import { pick } from "lodash";
import { sendMail } from "../utils/nodemailer";

export default class AuthController {
  async recover(
    req: Request<{}, {}, SendOTPAndRecoverEmail["body"]>,
    res: Response
  ) {
    const { email } = req.body;
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (!existingUser) throw new BadRequestError("Invalid email");
    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString("hex");
    const date: Date = new Date();
    date.setHours(date.getHours() + 1);
    await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        passwordResetToken: randomCharacters,
        passwordResetExpires: date,
      },
    });
    const resetLink = `${configs.CLIENT_URL}/auth/recover?token=${randomCharacters}`;
    await sendMail("recover", email, {
      appIcon: "",
      appLink: "",
      resetLink,
    });

    return res.status(StatusCodes.OK).send({
      statusCode: StatusCodes.OK,
      status: "success",
      message: "Send email success",
    });
  }

  async resetPassword(
    req: Request<ResetPassword["params"], {}, ResetPassword["body"]>,
    res: Response
  ) {
    const { token } = req.params;
    const { password } = req.body;
    const existingUser = await prisma.user.findFirst({
      where: {
        passwordResetToken: token,
        passwordResetExpires: { gte: new Date() },
      },
    });
    if (!existingUser) throw new BadRequestError("Reset token has expired");
    const hash = hashData(password);
    const newUser = await prisma.user.update({
      where: {
        id: existingUser.id,
      },
      data: {
        password: hash,
        passwordResetExpires: null,
        passwordResetToken: null,
      },
    });
    return res.status(StatusCodes.OK).send({
      statusCode: StatusCodes.OK,
      status: "success",
      message: "Reset password success",
      metadata: { user: pick(newUser, ["id", "email", "role", "isBlocked"]) },
    });
  }

  async sendOTP(
    req: Request<{}, {}, SendOTPAndRecoverEmail["body"]>,
    res: Response
  ) {
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

    if (!otp) {
      await prisma.otp.create({
        data: {
          email,
          code: signJWT(code, configs.JWT_SECRET),
          expireAt: new Date(Date.now() + 1000 * 60 * 5).toISOString(),
        },
      });
    }

    await sendMail("verifyEmail", email, {
      appIcon: "",
      appLink: "",
      code,
    });

    return res.status(StatusCodes.OK).send({
      statusCode: StatusCodes.OK,
      status: "success",
      message: "Send email success",
    });
  }

  async signUp(req: Request<{}, {}, SignUp["body"]>, res: Response) {
    const { email, password, code, username } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) throw new BadRequestError("User already exists");
    const date: Date = new Date();
    date.setMinutes(date.getMinutes() + 1);
    const otp = await prisma.otp.findFirst({
      where: {
        verified: false,
        email,
        AND: [
          { expireAt: { gte: new Date() } },
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
    return res.status(StatusCodes.CREATED).send({
      statusCode: StatusCodes.CREATED,
      status: "success",
      message: "Sign up success",
      metadata: { user: pick(newUser, ["id", "email", "role", "isBlocked"]) },
    });
  }

  async signIn(req: Request, res: Response) {
    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      status: "success",
      message: "Sign in success",
      metadata: {
        user: req.user,
      },
    });
  }

  async signOut(req: Request, res: Response) {
    req.logout(function (err) {
      if (err) {
        console.log(err);
        throw new BadRequestError("Sign out error");
      }
    });
    res.clearCookie("session");
    res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      status: "success",
      message: "Sign out successful",
    });
  }
}
