import { NotFoundError } from "@/shared/error-handler";
import { Multer } from "multer";
import ImageRepositories from "./image.repositories";

export default class ImageServices {
  static async upload(userId: string, file?: Express.Multer.File) {
    if (!file) {
      throw new NotFoundError("No file uploaded");
    }

    return await ImageRepositories.uploadImage({
      url: `/api/v1/images/${file.filename}`,
      filename: file.originalname,
      size: file.size,
      mimeType: file.mimetype,
      userId: userId,
    });
  }
}
