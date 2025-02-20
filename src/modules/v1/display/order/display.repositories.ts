import prisma from "@/shared/db/connect";
import { CreateDisplayOrder } from "./display.schema";
import { DisplayOrderCache, DisplayOrderProductCache } from "./display.cache";

export default class DisplayOrderRepositories {
  static async checkRoomNotExists(roomIds: string[]) {
    const rooms = await prisma.room.findMany({
      where: {
        id: {
          in: roomIds,
        },
      },
      select: {
        id: true,
      },
    });
    const idErrs = rooms
      .map(({ id }) => id)
      .filter((id) => !roomIds.includes(id));
    if (idErrs.length == 0) return null;
    return idErrs[0];
  }
  static async createNewDisplayOrder(
    data: CreateDisplayOrder,
    storeCache?: boolean
  ) {
    const { products, room_ids, ...d } = data;

    const displayOrder = await prisma.displayOrder.create({
      data: {
        ...d,
        products: {
          create: products,
        },
        display_order_rooms: {
          create: room_ids.map((room_id) => ({ room_id })),
        },
      },
      include: {
        products: true,
        display_order_rooms: {
          select: {
            room: true,
          },
        },
      },
    });

    const {
      products: productList,
      display_order_rooms,
      ...newDisplay
    } = displayOrder;

    if (storeCache ?? true) {
      await DisplayOrderCache.store(newDisplay);
      for (const product of productList) {
        await DisplayOrderProductCache.store(product);
      }
    }
    return newDisplay;
  }

  static async getDisplayOrderById(displayOrderId: string, cache?: boolean) {
    if (cache ?? true) {
      const displayOrderCache = await DisplayOrderCache.getDisplayOrderById(
        displayOrderId
      );
      if (displayOrderCache) return displayOrderCache;
    }

    const displayOrder = await prisma.displayOrder.findUnique({
      where: {
        id: displayOrderId,
      },
    });

    if (!displayOrder) return null;
    if (cache ?? true) {
      await DisplayOrderCache.store(displayOrder);
    }
    return displayOrder;
  }

  static async deleteDisplayOrderById(
    displayOrderId: string,
    clearCache?: boolean
  ) {
    const {
      products: productList,
      display_order_rooms,
      ...deletedDisplay
    } = await prisma.displayOrder.delete({
      where: { id: displayOrderId },
      include: {
        products: true,
        display_order_rooms: {
          select: {
            room: true,
          },
        },
      },
    });

    if (clearCache ?? true) {
      await DisplayOrderCache.deleteDisplayOrderById(displayOrderId);
      for (const product of productList) {
        await DisplayOrderProductCache.delete(displayOrderId, product.id);
      }
    }

    return deletedDisplay;
  }
}
