import { Cookie } from "express-session";
import { redisClient } from "./connection";
import { ISessionDataStore } from "../passport";

type SessionRedis = {
  cookie: Cookie;
  passport: {
    user: ISessionDataStore;
  };
};

export async function getAllSessionOf(
  pattern: string
): Promise<SessionRedis[]> {
  const keys = await redisClient.keys(pattern);
  const data: SessionRedis[] = [];
  for (const id of keys) {
    const sess = await redisClient.get(id);
    if (sess) {
      data.push(JSON.parse(sess));
    }
  }
  return data;
}

export async function getData(key: string) {
  return await redisClient.get(key);
}

export async function deteleAllSession(pattern: string) {
  const keys = await redisClient.keys(pattern);
  if (keys && keys.length > 0) await redisClient.del(keys);
}
