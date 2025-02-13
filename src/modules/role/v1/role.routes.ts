import express, { type Router } from "express";
import RoleControllers from "./role.controllers";
import { authMiddleware } from "@/shared/middlewares/authMiddleware";
import validateResource from "@/shared/middlewares/validateResource";
import { createRoleSchema, updateRoleSchema } from "./role.schema";

const router: Router = express.Router();

router.get("/:roleId", authMiddleware(), RoleControllers.getRoleById);
router.get("/", authMiddleware(), RoleControllers.getRoles);

router.post(
  "/",
  authMiddleware(),
  validateResource(createRoleSchema),
  RoleControllers.createNewRole
);

router.put(
  "/:roleId",
  authMiddleware(),
  validateResource(updateRoleSchema),
  RoleControllers.updateRoleById
);

router.delete("/:roleId", authMiddleware(), RoleControllers.deleteRoleById);

export default router;
