import prisma from "@/shared/db/connect";
import { CreateProduct, UpdateProduct } from "./product.schema";

export default class ProductRepositories {
  static async createNewProduct(data: CreateProduct) {
    const product = await prisma.product.create({
      data,
    });
    return product;
  }

  static async getProductById(productId: string) {
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) return null;
    return product;
  }

  static async getProducts() {
    const products = await prisma.product.findMany({});
    return products;
  }

  static async updateProductById(productId: string, data: UpdateProduct) {
    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data,
    });
    return product;
  }

  static async deleteProductById(productId: string) {
    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    });
    return product;
  }
}
