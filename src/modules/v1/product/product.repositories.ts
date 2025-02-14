import prisma from "@/shared/db/connect";
import { CreateProduct } from "./product.schema";
import ProductCache from "./product.cache";

export default class ProductRepositories {
  static async createProduct(data: CreateProduct, storeCache?: boolean) {
    const product = await prisma.product.create({
      data,
    });
    if (storeCache ?? true) {
      await ProductCache.store(product);
    }
    return product;
  }
}
