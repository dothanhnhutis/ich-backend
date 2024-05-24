import crypto from "crypto";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/db";
import { BadRequestError, NotFoundError } from "../error-handler";
import { CurrentUser } from "../schemas/user.schema";
import { sendMail } from "../utils/nodemailer";
import configs from "../configs";

export default class UserController {
  async currentUser(req: Request, res: Response) {
    // console.log(req.session);
    res.status(StatusCodes.OK).send(req.user);
  }

  async getUserByToken(req: Request<{ token: string }>, res: Response) {
    const { token } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        passwordResetToken: token,
      },
      select: {
        id: true,
        passwordResetToken: true,
        passwordResetExpires: true,
      },
    });
    if (!user) throw new NotFoundError();
    console.log(user);
    return res.status(StatusCodes.OK).json(user);
  }

  async sendVerifyEmail(req: Request, res: Response) {
    const currentUser = req.user! as CurrentUser;
    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
      select: {
        email: true,
        emailVerificationToken: true,
      },
    });
    if (!user) throw new BadRequestError("User not exist");
    const verificationLink = `${configs.CLIENT_URL}/confirm-email?v_token=${user.emailVerificationToken}`;

    await sendMail("verifyEmail", user.email, {
      appIcon: "",
      appLink: "",
      verificationLink,
    });
    return res.status(StatusCodes.OK).json({
      message:
        "New verification email is successfully sent. Please, check your email...",
    });
  }

  async changeEmail(req: Request<{}, {}, { email: string }>, res: Response) {
    const { email } = req.body;

    const currentUser = req.user! as CurrentUser;
    const checkNewEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (checkNewEmail) throw new BadRequestError("Email already exists");

    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
    });
    if (!user) throw new BadRequestError("User not exist");
    await prisma.user.update({
      where: {
        id: user.id,
      },
      data: {
        email,
      },
    });

    const randomBytes: Buffer = await Promise.resolve(crypto.randomBytes(20));
    const randomCharacters: string = randomBytes.toString("hex");
    const verificationLink = `${configs.CLIENT_URL}/confirm-email?v_token=${randomCharacters}`;

    await sendMail("verifyEmail", email, {
      appIcon: "",
      appLink: "",
      verificationLink,
    });
    return res.status(StatusCodes.OK).json({
      message: "Updated and resending e-mail...",
    });
  }

  async edit(req: Request, res: Response) {
    res.status(StatusCodes.OK).json({ message: "sadsad" });
  }
}
