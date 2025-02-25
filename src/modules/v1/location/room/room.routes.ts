import { authMiddleware } from "@/shared/middlewares/authMiddleware";
import express, { type Router } from "express";
import RoomControllers from "./room.controllers";
import validateResource from "@/shared/middlewares/validateResource";
import { createRoomSchema, updateRoomSchema } from "./room.schema";

const router: Router = express.Router({ mergeParams: true });

router.get("/", authMiddleware(), RoomControllers.getRoomsOfLocation);

router.post(
  "/",
  authMiddleware(),
  validateResource(createRoomSchema),
  RoomControllers.addRoomToLocation
);

router.put(
  "/:roomId",
  authMiddleware(),
  validateResource(updateRoomSchema),
  RoomControllers.updateRoomById
);

router.delete("/:roomId", authMiddleware(), RoomControllers.deleteRoomById);

export default router;
