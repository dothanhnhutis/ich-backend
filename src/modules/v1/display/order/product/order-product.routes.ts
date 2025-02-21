import express, { type Router } from "express";
import { authMiddleware } from "@/shared/middlewares/authMiddleware";
import DisplayOrderProductControllers from "./order-product.controllers";
import validateResource from "@/shared/middlewares/validateResource";
import {
  createDisplayOrderProductSchema,
  updateDisplayOrderProductSchema,
} from "./order-product.schema";

const router: Router = express.Router({ mergeParams: true });

router.get(
  "/",
  authMiddleware(),
  DisplayOrderProductControllers.getDisplayOrderProducts
);

router.post(
  "/",
  authMiddleware(),
  validateResource(createDisplayOrderProductSchema),
  DisplayOrderProductControllers.addProductToDisplayOrder
);

router.put(
  "/:productId",
  authMiddleware(),
  validateResource(updateDisplayOrderProductSchema),
  DisplayOrderProductControllers.updateProductOfDisplayOrder
);

router.delete(
  "/:productId",
  authMiddleware(),
  DisplayOrderProductControllers.removeProductToDisplayOrder
);

export default router;
