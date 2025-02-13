import prisma from "@/shared/db/connect";
import { CreateLocation, UpdateLocation } from "./location.schema";
import LocationCache from "./location.cache";

export default class LocationRepositories {
  static async getLocations() {
    const location = await prisma.location.findMany();
    return location;
  }
  static async createLocation(data: CreateLocation, storeCache?: boolean) {
    const location = await prisma.location.create({
      data,
    });
    if (storeCache ?? true) {
      await LocationCache.create(location);
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
    });

    if (location) {
      if (cache ?? true) {
        await LocationCache.create(location);
      }
    }
    return location;
  }

  static async updateLocationById(
    locationId: string,
    data: UpdateLocation,
    updateCache?: boolean
  ) {
    const location = await prisma.location.update({
      where: {
        id: locationId,
      },
      data,
    });
    if (updateCache ?? true) {
      await LocationCache.create(location);
    }
    return location;
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
