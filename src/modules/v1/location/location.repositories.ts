import prisma from "@/shared/db/connect";
import { CreateLocation, UpdateLocation } from "./location.schema";

export default class LocationRepositories {
  static async getLocations() {
    const location = await prisma.location.findMany({
      include: {
        rooms: true,
      },
    });
    return location;
  }

  static async createLocation(data: CreateLocation) {
    const { room_names, ...locationData } = data;
    const location = await prisma.location.create({
      data: {
        ...locationData,
        rooms: {
          create: room_names.map((room_name) => ({ room_name })),
        },
      },
      include: {
        rooms: true,
      },
    });

    return location;
  }

  static async getLocationById(locationId: string) {
    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: {
        rooms: true,
      },
    });
    return location;
  }

  static async updateLocationById(locationId: string, data: UpdateLocation) {
    const { rooms, ...locationData } = data;

    const location = await prisma.$transaction(async (tx) => {
      if (rooms)
        for (const room of rooms) {
          if ("room_id" in room && "room_name" in room) {
            await tx.room.update({
              where: {
                id: room.room_id,
              },
              data: {
                room_name: room.room_name,
              },
            });
          } else if ("room_id" in room) {
            await tx.room.delete({
              where: {
                id: room.room_id,
              },
            });
          } else if ("room_name" in room) {
            await tx.room.create({
              data: {
                location_id: locationId,
                room_name: room.room_name,
              },
            });
          }
        }

      return await tx.location.update({
        where: {
          id: locationId,
        },
        data: locationData,
        include: {
          rooms: true,
        },
      });
    });

    return location;
  }

  static async getRoomOfLocation(locationId: string) {
    const location = await prisma.location.findUnique({
      where: {
        id: locationId,
      },
      include: {
        rooms: true,
      },
    });

    if (!location) return [];
    return location.rooms;
  }

  static async deleteLocationById(locationId: string) {
    const location = await prisma.location.delete({
      where: {
        id: locationId,
      },
    });

    return location;
  }
}
