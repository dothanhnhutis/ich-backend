import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import prisma from "../utils/db";
import { BadRequestError, NotFoundError } from "../error-handler";

export default class UserController {
  async currentUser(req: Request, res: Response) {
    // console.log(req.session);
    res.status(StatusCodes.OK).send({
      statusCode: StatusCodes.OK,
      status: "success",
      message: "Get user success",
      metadata: {
        user: req.user,
      },
    });
  }

  async getUserByToken(req: Request<{ token: string }>, res: Response) {
    const { token } = req.params;
    const user = await prisma.user.findUnique({
      where: {
        passwordResetToken: token,
      },
    });
    if (!user) throw new NotFoundError();

    return res.status(StatusCodes.OK).json({
      statusCode: StatusCodes.OK,
      status: "success",
      message: "Get user success",
      metadata: {
        user,
      },
    });
  }
}
