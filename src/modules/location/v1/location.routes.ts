import express, { Router } from "express";
import LocationControllers from "./location.controllers";
import { authMiddleware } from "@/shared/middlewares/authMiddleware";
import validateResource from "@/shared/middlewares/validateResource";
import { createLocationSchema, updateLocationSchema } from "./location.schema";

const router: Router = express.Router();

router.get(
  "/:locationId",
  authMiddleware(),
  LocationControllers.getLocationById
);
router.get("/", authMiddleware(), LocationControllers.getLocations);

router.post(
  "/",
  authMiddleware(),
  validateResource(createLocationSchema),
  LocationControllers.createLocation
);

router.put(
  "/:locationId",
  authMiddleware(),
  validateResource(updateLocationSchema),
  LocationControllers.updateLocation
);

router.delete(
  "/:locationId",
  authMiddleware(),
  LocationControllers.deleteLocation
);

export default router;
