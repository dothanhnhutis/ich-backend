import express, { Router } from "express";
import upload from "@/shared/multer";
import ImageControllers from "./image.controllers";
import { authMiddleware } from "@/shared/middlewares/authMiddleware";
const router: Router = express.Router();

router.post(
  "/upload",
  authMiddleware(),
  upload.single("image"),
  ImageControllers.upload
);

router.get("/:filename", ImageControllers.getImage);

export default router;
