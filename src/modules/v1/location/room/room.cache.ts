import { cache } from "@/shared/cache/connect";
import { Room } from "./room.schema";
import { CACHE_TTL } from "@/shared/configs/constants";
import logger from "@/shared/logger";
import { QueryCacheError } from "@/shared/error-handler";

export default class RoomCache {
  static async store(data: Room) {
    try {
      await cache.set(
        `locations:${data.location_id}:rooms:${data.id}`,
        JSON.stringify(data),
        "EX",
        CACHE_TTL
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`RoomCache.store() method error: `, error);
        throw new QueryCacheError(
          `RoomCache.store() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getRoomOfLocation(locationId: string, roomId: string) {
    try {
      const room = await cache.get(`locations:${locationId}:rooms:${roomId}`);
      return room ? (JSON.parse(room) as Room) : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`RoomCache.getRoomOfLocation() method error: `, error);
        throw new QueryCacheError(
          `RoomCache.getRoomOfLocation() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async deleteRoomOfLocation(locationId: string, roomId: string) {
    try {
      await cache.del(`locations:${locationId}:rooms:${roomId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`RoomCache.deleteRoomOfLocation() method error: `, error);
        throw new QueryCacheError(
          `RoomCache.deleteRoomOfLocation() method error: ${error.message}`
        );
      }
      throw error;
    }
  }
}
