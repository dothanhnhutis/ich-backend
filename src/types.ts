import "express";

declare global {
  namespace Express {
    interface User {
      username: string;
    }
  }
}
