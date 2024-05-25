import "express";
import { CurrentUser } from "./schemas/user.schema";

declare global {
  namespace Express {
    interface User extends CurrentUser {}
  }
}
