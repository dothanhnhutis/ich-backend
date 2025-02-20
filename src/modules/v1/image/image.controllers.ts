import prisma from "@/shared/db/connect";
import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import logger from "@/shared/logger";
import { StatusCodes } from "http-status-codes";
import ImageServices from "./image.services";
export default class ImageControllers {
  static async upload(req: Request, res: Response) {
    const image = await ImageServices.upload(req.user!.id, req.file);
    res.json({
      message: "Image uploaded successfully",
      url: image.url,
    });
  }

  static async getImage(req: Request<{ filename: string }>, res: Response) {
    const { filename } = req.params;

    if (filename.includes("..")) {
      logger.warn(`security get image`);
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ error: "Invalid filename" });
    }

    const filePath = path.join(__dirname, "../uploads", filename);
    if (!fs.existsSync(filePath)) {
      logger.warn(`File not found: ${filePath}`);
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ error: "File not found" });
    }

    res.sendFile(filePath, (err) => {
      if (err) {
        logger.error("Error sending file:", err);
        res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .json({ error: "Error sending file" });
      }
    });
  }
}
