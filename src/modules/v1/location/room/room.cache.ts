import { cache } from "@/shared/cache/connect";
import { Room } from "./room.schema";
import { CACHE_TTL } from "@/shared/configs/constants";
import logger from "@/shared/logger";
import { QueryCacheError } from "@/shared/error-handler";

export default class RoomCache {
  static async store(data: Room) {
    try {
      await cache.set(`room:${data.id}`, JSON.stringify(data), "EX", CACHE_TTL);
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

  static async getRoomById(roomId: string) {
    try {
      const room = await cache.get(`room:${roomId}`);
      return room ? (JSON.parse(room) as Room) : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`RoomCache.getRoomById() method error: `, error);
        throw new QueryCacheError(
          `RoomCache.getRoomById() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async deleteRoomById(roomId: string) {
    try {
      await cache.del(`room:${roomId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`RoomCache.deleteRoomById() method error: `, error);
        throw new QueryCacheError(
          `RoomCache.deleteRoomById() method error: ${error.message}`
        );
      }
      throw error;
    }
  }
}
