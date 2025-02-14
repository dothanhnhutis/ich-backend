import { cache } from "@/shared/cache/connect";
import logger from "@/shared/logger";
import { DisplayOrder, DisplayOrderProduct } from "./display.schema";
import { CACHE_TTL } from "@/shared/configs/constants";
import { QueryCacheError } from "@/shared/error-handler";

export class DisplayOrderProductCache {
  static async store(data: DisplayOrderProduct) {
    try {
      await cache.set(
        `displayOrder:${data.displayOrderId}:product:${data.id}`,
        JSON.stringify(data),
        "EX",
        CACHE_TTL
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(
          `DisplayOrderProductCache.createNewDisplayOrderProduct() method error: `,
          error
        );
        throw new QueryCacheError(
          `DisplayOrderProductCache.createNewDisplayOrderProduct() method error: ${error.message}`
        );
      }
      throw error;
    }
  }
}

export class DisplayOrderCache {
  static async store(data: DisplayOrder) {
    try {
      await cache.set(
        `displayOrder:${data.id}`,
        JSON.stringify(data),
        "EX",
        CACHE_TTL
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(
          `DisplayOrderCache.createNewDisplayOrder() method error: `,
          error
        );
        throw new QueryCacheError(
          `DisplayOrderCache.createNewDisplayOrder() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async getDisplayOrderById(displayOrderId: string) {
    try {
      const displayOrder = await cache.get(`displayOrder:${displayOrderId}`);
      return displayOrder ? (JSON.parse(displayOrder) as DisplayOrder) : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(
          `DisplayOrderCache.getDisplayOrderById() method error: `,
          error
        );
        throw new QueryCacheError(
          `DisplayOrderCache.getDisplayOrderById() method error: ${error.message}`
        );
      }
      throw error;
    }
  }
}
