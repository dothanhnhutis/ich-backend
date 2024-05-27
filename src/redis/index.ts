import configs from "../configs";
import RedisStore from "connect-redis";
import Redis from "ioredis";
import { RedisError } from "../error-handler";

export function createRedisStore() {
  const redisClient = new Redis(configs.REDIS_HOST);

  redisClient.on("error", function (err) {
    console.log("Could not establish a connection with redis. " + err);
  });

  redisClient.on("connect", function () {
    console.log("Connected to redis successfully");
  });

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: "ich-cookie:",
  });
  return redisStore;
}
let connectionTimeout: NodeJS.Timeout, redisClient: Redis;
const statusConnectRedis = {
  CONNECT: "connect",
  END: "end",
  RECONNECT: "reconnecting",
  ERROR: "error",
};

const REDIS_CONNECT_TIMEOUT = 10000,
  CONNECT_REDIS_MESSAGE = {
    code: -99,
    message: "Redis connection error",
  };

const handleTimeoutError = () => {
  connectionTimeout = setTimeout(() => {
    throw new RedisError(
      CONNECT_REDIS_MESSAGE.message,
      CONNECT_REDIS_MESSAGE.code
    );
  }, REDIS_CONNECT_TIMEOUT);
};

const handleEventConnect = ({
  connectionRedis,
}: {
  connectionRedis: Redis;
}) => {
  connectionRedis.on(statusConnectRedis.CONNECT, () => {
    console.log(
      `connectionRedis - Connection status: ${statusConnectRedis.CONNECT}`
    );
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(statusConnectRedis.END, () => {
    console.log(
      `connectionRedis - Connection status: ${statusConnectRedis.END}`
    );
    handleTimeoutError();
  });
  connectionRedis.on(statusConnectRedis.RECONNECT, () => {
    console.log(
      `connectionRedis - Connection status: ${statusConnectRedis.RECONNECT}`
    );
    clearTimeout(connectionTimeout);
  });
  connectionRedis.on(statusConnectRedis.ERROR, (err) => {
    console.log(`connectionRedis - Connection status: error ${err}`);
    handleTimeoutError();
  });
};
export const initRedis = () => {
  const instanceRedis: Redis = new Redis(configs.REDIS_HOST);
  redisClient = instanceRedis;
  handleEventConnect({ connectionRedis: instanceRedis });
};

export const getRedis = () => {
  return redisClient;
};

export const closeRedis = () => {
  process.on("SIGINT", () => {
    redisClient.disconnect();
  });
};
