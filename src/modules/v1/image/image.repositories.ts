import prisma from "@/shared/db/connect";

export default class ImageRepositories {
  static async uploadImage(data: {
    url: string;
    filename: string;
    size: number;
    mimeType: string;
    userId?: string;
  }) {
    const image = await prisma.image.create({
      data,
    });
    return image;
  }
}
