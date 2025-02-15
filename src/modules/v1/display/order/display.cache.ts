import { cache } from "@/shared/cache/connect";
import logger from "@/shared/logger";
import { DisplayOrder, DisplayOrderProduct } from "./display.schema";
import { CACHE_TTL } from "@/shared/configs/constants";
import { QueryCacheError } from "@/shared/error-handler";

export class DisplayOrderProductCache {
  static async store(data: DisplayOrderProduct) {
    try {
      await cache.set(
        `displayOrder:${data.display_order_id}:product:${data.id}`,
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

  static async getDisplayOrderProductById(
    displayOrderId: string,
    displayOrderProductId: string
  ) {
    try {
      const displayOrderProduct = await cache.get(
        `displayOrder:${displayOrderId}:product:${displayOrderProductId}`
      );
      return displayOrderProduct
        ? (JSON.parse(displayOrderProduct) as DisplayOrderProduct)
        : null;
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(
          `DisplayOrderProductCache.getDisplayOrderProductById() method error: `,
          error
        );
        throw new QueryCacheError(
          `DisplayOrderProductCache.getDisplayOrderProductById() method error: ${error.message}`
        );
      }
      throw error;
    }
  }

  static async delete(displayOrderId: string, displayOrderProductId: string) {
    try {
      await cache.del(
        `displayOrder:${displayOrderId}:product:${displayOrderProductId}`
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`DisplayOrderProductCache.delete() method error: `, error);
        throw new QueryCacheError(
          `DisplayOrderProductCache.delete() method error: ${error.message}`
        );
      }
      throw error;
    }
  }
}

// export class DisplayOrderRoomCache {
//   static async store(data:) {

//   }

//   static async delete() {}
// }

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

  static async deleteDisplayOrderById(displayOrderId: string) {
    try {
      await cache.del(`displayOrder:${displayOrderId}`);
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(
          `DisplayOrderCache.deleteDisplayOrderById() method error: `,
          error
        );
        throw new QueryCacheError(
          `DisplayOrderCache.deleteDisplayOrderById() method error: ${error.message}`
        );
      }
      throw error;
    }
  }
}
