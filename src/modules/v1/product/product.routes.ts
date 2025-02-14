import { authMiddleware } from "@/shared/middlewares/authMiddleware";
import validateResource from "@/shared/middlewares/validateResource";
import express, { type Router } from "express";
import ProductControllers from "./product.controllers";
import { createProductSchema, updateProductSchema } from "./product.schema";

const router: Router = express.Router();

router.get("/:productId", authMiddleware(), ProductControllers.getProductById);
router.get("/", authMiddleware(), ProductControllers.getProducts);

router.post(
  "/",
  authMiddleware(),
  validateResource(createProductSchema),
  ProductControllers.createNewProduct
);

router.put(
  "/:productId",
  authMiddleware(),
  validateResource(updateProductSchema),
  ProductControllers.updateProductById
);

router.delete(
  "/:productId",
  authMiddleware(),
  ProductControllers.deleteProductById
);

export default router;
