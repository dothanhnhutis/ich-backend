import { boolean } from "zod";
import { CreateRoom, UpdateRoom } from "./room.schema";
import prisma from "@/shared/db/connect";
import RoomCache from "./room.cache";

export default class RoomRepositories {
  static async addRoomToLocation(data: CreateRoom, storeCache?: boolean) {
    const room = await prisma.room.create({
      data,
    });
    if (storeCache ?? true) {
      RoomCache.store(room);
    }
    return room;
  }

  static async getRoomsOfLocation(locationId: string, cache?: boolean) {
    if (cache ?? true) {
      return await RoomCache.getRoomsOfLocation(locationId);
    }

    return await prisma.room.findMany({
      where: {
        location_id: locationId,
      },
    });
  }

  static async getRoomOfLocation(
    locationId: string,
    roomId: string,
    cache?: boolean
  ) {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room || locationId != room.location_id) return null;
    if (cache ?? true) {
      await RoomCache.store(room);
    }

    return room;
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

  static async deleteRoomOfLocation(
    locationId: string,
    roomId: string,
    clearCache?: boolean
  ) {
    const room = await prisma.room.delete({
      where: {
        id: roomId,
      },
    });

    if (clearCache ?? true) {
      await RoomCache.deleteRoomOfLocation(locationId, roomId);
    }

    return room;
  }
}
