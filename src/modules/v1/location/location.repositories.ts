import prisma from "@/shared/db/connect";
import { CreateLocation, UpdateLocation } from "./location.schema";
import LocationCache from "./location.cache";

export default class LocationRepositories {
  static async getLocations() {
    const location = await prisma.location.findMany({
      include: {
        rooms: true,
      },
    });
    return location;
  }

  static async createLocation(data: CreateLocation, storeCache?: boolean) {
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
    if (storeCache ?? true) {
      await LocationCache.store(location);
    }
    return location;
  }

  static async getLocationById(locationId: string, cache?: boolean) {
    if (cache ?? true) {
      const locationCache = await LocationCache.getLocationById(locationId);
      if (locationCache) return locationCache;
    }
    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: {
        rooms: true,
      },
    });

    if (location && (cache ?? true)) {
      await LocationCache.store(location);
    }
    return location;
  }

  static async updateLocationById(
    locationId: string,
    data: UpdateLocation,
    updateCache?: boolean
  ) {
    const { rooms, ...locationData } = data;

    prisma.$transaction([
      prisma.location.update({
        where: {
          id: locationId,
        },
        data: locationData,
        include: {
          rooms: true,
        },
      }),
    ]);
    const location = await prisma.location.update({
      where: {
        id: locationId,
      },
      data: locationData,
      include: {
        rooms: true,
      },
    });
    if (updateCache ?? true) {
      await LocationCache.store(location);
    }
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

  static async deleteLocationById(locationId: string, clearCache?: boolean) {
    const location = await prisma.location.delete({
      where: {
        id: locationId,
      },
    });
    if (clearCache ?? true) {
      await LocationCache.deleteLocationById(locationId);
    }
    return location;
  }
}
