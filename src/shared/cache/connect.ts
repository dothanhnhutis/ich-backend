import Redis from "ioredis";
import env from "@/shared/configs/env";
import logger from "../logger";
import { ConnectCacheError } from "../error-handler";

let cache: Redis, connectionTimeout: NodeJS.Timeout;

const REDIS_CONNECT_TIMEOUT = env.NODE_ENV == "development" ? 0 : 10000;

function handleTimeoutError() {
  connectionTimeout = setTimeout(() => {
    throw new ConnectCacheError("Redis reconnect time out");
  }, REDIS_CONNECT_TIMEOUT);
}

function handleEventConnect(redisClient: Redis) {
  redisClient.on("connect", () => {
    logger.info("Redis connection status: connected");
    clearTimeout(connectionTimeout);
  });
  redisClient.on("end", () => {
    logger.warn("Redis connection status: disconnected");
    handleTimeoutError();
  });
  redisClient.on("reconnecting", () => {
    logger.warn("Redis connection status: reconnecting");
    clearTimeout(connectionTimeout);
  });
  redisClient.on("error", (err) => {
    logger.error(`Redis connection status: error ${err}`);
    handleTimeoutError();
  });
}

export function connectCache(): void {
  const instanceRedis: Redis = new Redis(env.REDIS_HOST, {
    maxRetriesPerRequest: null,
  });
  cache = instanceRedis;
  handleEventConnect(cache);
  // for (const s of ["SIGINT", "SIGTERM"]) {
  //   process.once(s, () => {
  //     cache.disconnect();
  //   });
  // }
}

export { cache };
