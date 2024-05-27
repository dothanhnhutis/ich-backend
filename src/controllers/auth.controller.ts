import crypto from "crypto";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/db";
import { BadRequestError, NotFoundError } from "../error-handler";
import { signJWT, verifyJWT } from "../utils/jwt";
import { compareData, generateOTPCode, hashData } from "../utils/helper";
import {
  ChangePassword,
  CurrentUser,
  ResetPassword,
  SendRecoverEmail,
  SignUp,
  VerifyEmail,
} from "../schemas/user.schema";
import configs from "../configs";
import { pick } from "lodash";
import { sendMail } from "../utils/nodemailer";

export default class AuthController {
  async recover(req: Request<{}, {}, SendRecoverEmail["body"]>, res: Response) {
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
    const resetLink = `${configs.CLIENT_URL}/auth/reset-password?token=${randomCharacters}`;
    await sendMail("recover", email, {
      appIcon: "",
      appLink: "",
      resetLink,
    });

    return res.status(StatusCodes.OK).send({
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
    await prisma.user.update({
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
      message: "Reset password success",
    });
  }

  async verifyEmail(req: Request<VerifyEmail["params"]>, res: Response) {
    const { token } = req.params;
    const user = await prisma.user.findUnique({
      where: { emailVerificationToken: token },
    });
    if (!user) throw new NotFoundError();
    if (!user.emailVerified)
      await prisma.user.update({
        where: { emailVerificationToken: token },
        data: {
          emailVerified: true,
        },
      });
    return res.status(StatusCodes.OK).json({
      message: "verify email success",
    });
  }

  async signUp(req: Request<{}, {}, SignUp["body"]>, res: Response) {
    const { email, password, username } = req.body;
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (user) throw new BadRequestError("User already exists");

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString("hex");
    const verificationLink = `${configs.CLIENT_URL}/confirm-email?v_token=${randomCharacters}`;

    const hash = hashData(password);
    const newUser = await prisma.user.create({
      data: {
        email: email,
        password: hash,
        username,
        emailVerificationToken: randomCharacters,
      },
    });

    await sendMail("verifyEmail", email, {
      appIcon: "",
      appLink: "",
      verificationLink,
    });

    return res.status(StatusCodes.CREATED).send({
      message: "Sign up success",
      user: pick(newUser, ["id", "email", "role", "isBlocked"]),
    });
  }

  async signIn(req: Request, res: Response) {
    res.status(StatusCodes.OK).json({
      message: "Sign in success",
      user: req.user,
    });
  }

  async signOut(req: Request, res: Response) {
    console.log(req.user);
    req.logout(function (err) {
      if (err) {
        throw new BadRequestError("Sign out error");
      }
    });

    res
      .status(StatusCodes.OK)
      .clearCookie("session")
      .json({
        message: "Sign out successful",
      })
      .end();
  }

  async emailEnableActive(
    req: Request<{}, {}, { email: string }>,
    res: Response
  ) {
    const { email } = req.body;
    const userExist = await prisma.user.findUnique({ where: { email } });
    if (!userExist) throw new BadRequestError("User not exist");

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString("hex");
    const verificationLink = `${configs.CLIENT_URL}/auth/enable?v_token=${randomCharacters}`;
    const date: Date = new Date();
    date.setHours(date.getHours() + 24);

    await prisma.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        activeAccountToken: randomCharacters,
        activeAccountExpires: date,
      },
    });

    if (!userExist.emailVerified)
      await sendMail("verifyEmail", email, {
        appIcon: "",
        appLink: "",
        verificationLink,
      });
    return res.status(StatusCodes.OK).json({
      message: "Edit password success",
    });
  }
}
