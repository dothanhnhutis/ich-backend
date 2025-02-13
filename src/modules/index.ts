import { Router } from "express";
import userRoutes from "./user";
import locationRoutes from "./location";
import roleRoutes from "./role";
import roomRoutes from "./room";
import displayRoutes from "./display";

const router = Router();

router.use("/users", userRoutes);
router.use("/locations", locationRoutes);
router.use("/roles", roleRoutes);
router.use("/rooms", roomRoutes);
router.use("/displays", displayRoutes);

export default router;
