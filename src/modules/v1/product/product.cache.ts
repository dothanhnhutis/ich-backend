import { cache } from "@/shared/cache/connect";
import { Product } from "./product.schema";
import { CACHE_TTL } from "@/shared/configs/constants";
import logger from "@/shared/logger";
import { QueryCacheError } from "@/shared/error-handler";

export default class ProductCache {
  static async store(data: Product) {
    try {
      await cache.set(
        `product:${data.id}`,
        JSON.stringify(data),
        "EX",
        CACHE_TTL
      );
    } catch (error: unknown) {
      if (error instanceof Error) {
        logger.error(`ProductCache.store() method error: `, error);
        throw new QueryCacheError(
          `ProductCache.store() method error: ${error.message}`
        );
      }
      throw error;
    }
  }
}
