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
    const roomIdExists = rooms.map(({ id }) => id);
    const idErrs = roomIds.filter((id) => !roomIdExists.includes(id));
    if (idErrs.length == 0) return null;
    return idErrs[0];
  }

  static async createNewDisplayOrder(data: CreateDisplayOrder) {
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

    return {
      ...newDisplay,
      rooms: display_order_rooms.map(({ room }) => room),
      products: productList,
    };
  }

  static async getDisplayOrderById(displayOrderId: string) {
    const displayOrder = await prisma.displayOrder.findUnique({
      where: {
        id: displayOrderId,
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

    if (!displayOrder) return null;

    const {
      products: productList,
      display_order_rooms,
      ...newDisplay
    } = displayOrder;

    return {
      ...newDisplay,
      rooms: display_order_rooms.map(({ room }) => room),
      products: productList,
    };
  }

  static async getDisplayOrders() {
    const displayOrders = await prisma.displayOrder.findMany({
      include: {
        products: true,
        display_order_rooms: {
          select: {
            room: true,
          },
        },
      },
    });

    return displayOrders.map((displayOrder) => {
      const {
        products: productList,
        display_order_rooms,
        ...newDisplay
      } = displayOrder;

      return {
        ...newDisplay,
        rooms: display_order_rooms.map(({ room }) => room),
        products: productList,
      };
    });
  }

  static async deleteDisplayOrderById(displayOrderId: string) {
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

    return {
      ...deletedDisplay,
      rooms: display_order_rooms.map(({ room }) => room),
      products: productList,
    };
  }
}
