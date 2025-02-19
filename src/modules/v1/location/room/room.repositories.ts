import { CreateRoom, UpdateRoom } from "./room.schema";
import prisma from "@/shared/db/connect";

export default class RoomRepositories {
  static async addRoomToLocation(data: CreateRoom) {
    const room = await prisma.room.create({
      data,
    });

    return room;
  }

  static async getRoomsOfLocation(locationId: string) {
    const rooms = await prisma.room.findMany({
      where: {
        location_id: locationId,
      },
    });

    return rooms;
  }

  static async getRoomOfLocation(locationId: string, roomId: string) {
    const room = await prisma.room.findUnique({
      where: {
        id: roomId,
      },
    });

    if (!room || locationId != room.location_id) return null;

    return room;
  }

  static async updateRoomById(roomId: string, data: UpdateRoom) {
    const room = await prisma.room.update({
      where: {
        id: roomId,
      },
      data,
    });

    return room;
  }

  static async deleteRoomOfLocation(locationId: string, roomId: string) {
    const room = await prisma.room.delete({
      where: {
        id: roomId,
      },
    });

    return room;
  }
}
