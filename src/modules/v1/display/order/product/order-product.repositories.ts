import prisma from "@/shared/db/connect";
import {
  CreateDisplayOrderProduct,
  UpdateDisplayOrderProduct,
} from "./order-product.schema";

export default class OrderProductRepositories {
  static async getproductsOfOrderDisplay(displayOrderId: string) {
    const products = await prisma.displayOrderProduct.findMany({
      where: {
        display_order_id: displayOrderId,
      },
    });
    return products;
  }

  static async addProductToOrderDisplay(
    displayOrderId: string,
    product: CreateDisplayOrderProduct
  ) {
    const displayOrderProduct = await prisma.displayOrderProduct.create({
      data: {
        ...product,
        display_order_id: displayOrderId,
      },
    });

    return displayOrderProduct;
  }

  static async updateProductOfOrderDisplay(
    displayOrderId: string,
    data: UpdateDisplayOrderProduct
  ) {
    const product = await prisma.displayOrderProduct.update({
      where: {
        id: displayOrderId,
      },
      data,
    });
    return product;
  }

  static async removeProductToOrderDisplay(
    displayOrderId: string,
    productId: string
  ) {
    const displayOrderProduct = await prisma.displayOrderProduct.delete({
      where: {
        id: productId,
        display_order_id: displayOrderId,
      },
    });

    return displayOrderProduct;
  }
}
