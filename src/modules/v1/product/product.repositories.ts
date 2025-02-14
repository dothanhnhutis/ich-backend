import prisma from "@/shared/db/connect";
import { CreateProduct, UpdateProduct } from "./product.schema";
import ProductCache from "./product.cache";

export default class ProductRepositories {
  static async createNewProduct(data: CreateProduct, storeCache?: boolean) {
    const product = await prisma.product.create({
      data,
    });
    if (storeCache ?? true) {
      await ProductCache.store(product);
    }
    return product;
  }

  static async getProductById(productId: string, cache?: boolean) {
    if (cache ?? true) {
      const productCache = await ProductCache.getProductById(productId);
      if (productCache) return productCache;
    }

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) return null;

    if (cache ?? true) {
      await ProductCache.store(product);
    }

    return product;
  }

  static async updateProductById(
    productId: string,
    data: UpdateProduct,
    updateCache?: boolean
  ) {
    const product = await prisma.product.update({
      where: {
        id: productId,
      },
      data,
    });

    if (updateCache ?? true) {
      await ProductCache.store(product);
    }

    return prisma;
  }

  static async deleteProductById(productId: string, cleadCache?: boolean) {
    const product = await prisma.product.delete({
      where: {
        id: productId,
      },
    });

    if (cleadCache ?? true) {
      await ProductCache.deleteProductById(productId);
    }

    return product;
  }
}
