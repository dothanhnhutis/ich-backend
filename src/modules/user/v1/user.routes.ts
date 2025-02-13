import express, { Router } from "express";
import UserControllers from "./user.controllers";
import validateResource from "@/shared/middlewares/validateResource";
import { signInSchema } from "./user.schema";
import { authMiddleware } from "@/shared/middlewares/authMiddleware";

const router: Router = express.Router();

router.get(
  "/me",
  authMiddleware({ emailVerified: false }),
  UserControllers.currentUser
);

router.get(
  "/roles",
  authMiddleware({ emailVerified: false }),
  UserControllers.getRoles
);

router.get("/sessions", authMiddleware(), UserControllers.getSessions);

router.post("/signin", validateResource(signInSchema), UserControllers.signIn);

router.delete("/signout", UserControllers.signOut);
router.delete(
  "/sessions/:sessionId",
  authMiddleware(),
  UserControllers.deleteSessionById
);

export default router;
