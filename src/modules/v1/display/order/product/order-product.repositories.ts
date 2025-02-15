import prisma from "@/shared/db/connect";

export default class OrderProductRepositories {
  static async getproductsOfOrderDisplay(
    displayOrderId: string,
    cache?: boolean
  ) {
    const products = await prisma.displayOrderProduct.findMany({
      where: {
        display_order_id: displayOrderId,
      },
    });

    return products;
  }
}
