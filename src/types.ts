import "express";
import { ISessionDataStore } from "./passport";

declare global {
  namespace Express {
    interface User extends ISessionDataStore {}
  }
}
