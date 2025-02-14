import prisma from "@/shared/db/connect";
import { CreateDisplayOrder } from "./display.schema";
import { DisplayOrderCache, DisplayOrderProductCache } from "./display.cache";

export default class DisplayOrderRepositories {
  static async createNewDisplayOrder(
    data: CreateDisplayOrder,
    storeCache?: boolean
  ) {
    const { products, roomIds, ...d } = data;

    const displayOrder = await prisma.displayOrder.create({
      data: {
        ...d,
        products: {
          create: products,
        },
        displayOrderRooms: {
          create: roomIds.map((roomId) => ({ roomId })),
        },
      },
      include: {
        products: true,
        displayOrderRooms: {
          select: {
            room: true,
          },
        },
      },
    });

    const {
      products: productList,
      displayOrderRooms,
      ...newDisplay
    } = displayOrder;

    if (storeCache ?? true) {
      await DisplayOrderCache.store(newDisplay);
      for (const product of productList) {
        await DisplayOrderProductCache.store(product);
      }
    }

    return {
      ...newDisplay,
    };
  }

  static async getDisplayOrderById(displayOrderId: string, cache?: boolean) {
    if (cache ?? true) {
      const displayOrderCache = await DisplayOrderCache.getDisplayOrderById(
        displayOrderId
      );
      if (displayOrderCache) {
        return displayOrderCache;
      }
    }

    const displayOrder = await prisma.displayOrder.findUnique({
      where: {
        id: displayOrderId,
      },
      include: {
        products: true,
        displayOrderRooms: {
          select: {
            room: true,
          },
        },
      },
    });

    if (!displayOrder) return null;

    const {
      products: productList,
      displayOrderRooms,
      ...newDisplay
    } = displayOrder;

    if (cache ?? true) {
      await DisplayOrderCache.store(newDisplay);
      for (const product of productList) {
        await DisplayOrderProductCache.store(product);
      }
    }

    return {
      ...newDisplay,
      products: productList,
      rooms: displayOrderRooms.map((displayOrderRoom) => displayOrderRoom.room),
    };
  }

  static async deleteDisplayOrder(displayOrderId: string) {}
}
