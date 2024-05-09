import { Router } from "express";
import authRoutes from "./auth";

class Routes {
  router = Router();
  constructor() {
    this.router.get("/", (req, res) => {
      return res.send("oke");
    });
    this.router.use("/auth", authRoutes);
  }
}

export default new Routes().router;
