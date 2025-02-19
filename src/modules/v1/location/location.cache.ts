import { QueryCacheError } from "@/shared/error-handler";
import { Location, StoreLocationCache } from "./location.schema";
import logger from "@/shared/logger";
import { cache } from "@/shared/cache/connect";
import { CACHE_TTL } from "@/shared/configs/constants";
import { Room } from "./room/room.schema";

export default class LocationCache {
  static async store(data: StoreLocationCache) {
    try {
      await cache.set(
        `location:${data.id}`,
        JSON.stringify(data),
        "EX",
        CACHE_TTL
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`LocationCache.store() method error: `, error);
        throw new QueryCacheError(
          `LocationCache.store() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getLocationById(locationId: string) {
    try {
      const locationCache = await cache.get(`locations:${locationId}`);
      if (!locationCache) return null;
      const location: Location = JSON.parse(locationCache);

      const roomIds = await cache.keys(`locations:${location.id}:rooms:*`);

      const rooms: Room[] = [];
      for (const id of roomIds) {
        const room = await cache.get(id);
        if (!room) continue;
        rooms.push(JSON.parse(room) as Room);
      }

      return {
        ...location,
        rooms,
      } as StoreLocationCache;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`LocationCache.getLocationById() method error: `, error);
        throw new QueryCacheError(
          `LocationCache.getLocationById() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async deleteLocationById(locationId: string) {
    try {
      await cache.del(`location:${locationId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(
          `LocationCache.deleteLocationById() method error: `,
          error
        );
        throw new QueryCacheError(
          `LocationCache.deleteLocationById() method error: ${error.message}`
        );
      }
      throw error;
    }
  }
}
