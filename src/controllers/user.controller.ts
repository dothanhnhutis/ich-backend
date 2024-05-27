import crypto from "crypto";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/db";
import { BadRequestError, NotFoundError } from "../error-handler";
import {
  ChangePassword,
  CurrentUser,
  EditProfile,
} from "../schemas/user.schema";
import { sendMail } from "../utils/nodemailer";
import configs from "../configs";
import { compareData, hashData } from "../utils/helper";

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

    return res.status(StatusCodes.OK).json(user);
  }

  async sendVerifyEmail(req: Request, res: Response) {
    const currentUser = req.user! as CurrentUser;
    if (currentUser.emailVerified)
      throw new BadRequestError("Email has been verified");
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
    const currentUser = req.user!;
    if (currentUser.emailVerified)
      throw new BadRequestError("Email has been verified");
    const user = await prisma.user.findUnique({
      where: {
        id: currentUser.id,
      },
    });
    if (!user) throw new BadRequestError("User not exist");

    const checkNewEmail = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (checkNewEmail) throw new BadRequestError("Email already exists");

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

  async edit(req: Request<{}, {}, EditProfile["body"]>, res: Response) {
    const currentUser = req.user!;
    const data = req.body;
    await prisma.user.update({
      where: {
        id: currentUser.id,
      },
      data,
    });

    // if (data.isBlocked && data.isBlocked == true) {
    //   req.logout(function (err) {
    //     if (err) {
    //       console.log(err);
    //       throw new BadRequestError("Sign out error");
    //     }
    //   });
    //   res.clearCookie("session");

    // }
    return res.status(StatusCodes.OK).json({ message: "Edit profile success" });
  }

  async changPassword(
    req: Request<{}, {}, ChangePassword["body"]>,
    res: Response
  ) {
    const { currentPassword, newPassword } = req.body;
    const { id } = req.user! as { id: string };
    const userExist = await prisma.user.findUnique({ where: { id } });
    if (!userExist) throw new BadRequestError("User not exist");
    const isValidOldPassword = await compareData(
      userExist.password!,
      currentPassword
    );

    if (!isValidOldPassword)
      throw new BadRequestError("Old password is incorrect");

    await prisma.user.update({
      where: {
        id: userExist.id,
      },
      data: {
        password: hashData(newPassword),
      },
    });

    return res.status(StatusCodes.OK).json({
      message: "Edit password success",
    });
  }

  async disableActive(req: Request, res: Response) {
    const { id } = req.user! as { id: string };
    const userExist = await prisma.user.findUnique({ where: { id } });
    if (!userExist) throw new BadRequestError("User not exist");
    if (!userExist.isBlocked)
      await prisma.user.update({
        where: {
          id,
        },
        data: {
          isBlocked: true,
        },
      });

    req.logout(function (err) {
      if (err) {
        throw new BadRequestError("Sign out error");
      }
    });
    res.cookie("session", "", { maxAge: 0 });
    res
      .status(StatusCodes.OK)
      .json({
        message: "Diable account successful",
      })
      .end();
  }
}
