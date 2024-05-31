import { Request, Response } from "express";
import { getAllSessionOf } from "../redis/cache";
import { StatusCodes } from "http-status-codes";

export default class SessionController {
  async getAllSession(req: Request, res: Response) {
    const user = req.user!;
    const data = await getAllSessionOf(`sess:${user.id}:*`);
    return res.status(StatusCodes.OK).json(data);
  }
}
