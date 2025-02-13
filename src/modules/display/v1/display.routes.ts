import { authMiddleware } from "@/shared/middlewares/authMiddleware";
import express, { type Router } from "express";
import DisplayOrderControllers from "./display.controllers";
import validateResource from "@/shared/middlewares/validateResource";
import { createDisplayOrderSchema } from "./display.schema";

const router: Router = express.Router();

router.post(
  "/",
  authMiddleware(),
  validateResource(createDisplayOrderSchema),
  DisplayOrderControllers.createDisplayOrder
);

export default router;
