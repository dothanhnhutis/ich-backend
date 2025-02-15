import express, { type Router } from "express";
import { authMiddleware } from "@/shared/middlewares/authMiddleware";
import DisplayOrderProductControllers from "./order-product.controllers";

const router: Router = express.Router({ mergeParams: true });

router.get(
  "/",
  authMiddleware(),
  DisplayOrderProductControllers.getDisplayOrderProducts
);

export default router;
