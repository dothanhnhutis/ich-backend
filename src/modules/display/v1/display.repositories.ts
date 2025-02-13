import prisma from "@/shared/db/connect";
import { CreateDisplayOrder } from "./display.schema";

export default class DispalyOrderRepositories {
  static async createNewDisplayOrder(
    data: CreateDisplayOrder,
    storeCache?: boolean
  ) {
    const { products, ...d } = data;

    const displayOrder = await prisma.displayOrder.create({
      data: {
        ...d,
        products: {
          create: products,
        },
      },
      include: {
        products: true,
      },
    });

    if (storeCache ?? true) {
    }

    return displayOrder;
  }
}
