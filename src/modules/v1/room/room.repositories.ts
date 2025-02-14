import { boolean } from "zod";
import { CreateRoom, UpdateRoom } from "./room.schema";
import prisma from "@/shared/db/connect";
import RoomCache from "./room.cache";

export default class RoomRepositories {
  static async createNewRoom(data: CreateRoom, storeCache?: boolean) {
    const room = await prisma.room.create({
      data,
    });
    if (storeCache ?? true) {
      RoomCache.store(room);
    }
    return room;
  }

  static async getUniqueData(data: CreateRoom) {
    const room = await prisma.room.findUnique({
      where: {
        locationId_name: data,
      },
      include: {
        location: true,
      },
    });

    return room;
  }

  static async getRoomById(roomId: string, cache?: boolean) {
    if (cache ?? true) {
      const roomCache = await RoomCache.getRoomById(roomId);

      if (roomCache) return roomCache;
    }

    const room = await prisma.room.findUnique({ where: { id: roomId } });

    if (!room) return null;

    if (cache ?? true) {
      await RoomCache.store(room);
    }

    return room;
  }

  static async getRooms() {
    return await prisma.room.findMany();
  }

  static async updateRoomById(
    roomId: string,
    data: UpdateRoom,
    updateCache?: boolean
  ) {
    const room = await prisma.room.update({
      where: {
        id: roomId,
      },
      data,
    });

    if (updateCache ?? true) {
      RoomCache.store(room);
    }
    return room;
  }

  static async deleteRoomById(roomId: string, clearCache?: boolean) {
    const room = await prisma.room.delete({
      where: {
        id: roomId,
      },
    });

    if (clearCache ?? true) {
      await RoomCache.deleteRoomById(roomId);
    }

    return room;
  }
}
