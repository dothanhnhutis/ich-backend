import { Router } from "express";
import authRoutes from "./auth.router";
import userRoutes from "./user.router";
import { StatusCodes } from "http-status-codes";

class Routes {
  router = Router();
  constructor() {
    this.router.get("/health", (req, res) => {
      res.status(StatusCodes.OK).send("Service is healthy and OK.");
    });
    this.router.use("/auth", authRoutes);
    this.router.use("/users", userRoutes);
  }
}

export default new Routes().router;
