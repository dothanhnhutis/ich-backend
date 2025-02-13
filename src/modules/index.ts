import { Router } from "express";
import userRoutes from "./user";
import locationRoutes from "./location";
import roleRoutes from "./role";
import roomRoutes from "./room";

const router = Router();

router.use("/users", userRoutes);
router.use("/locations", locationRoutes);
router.use("/roles", roleRoutes);
router.use("/rooms", roomRoutes);

export default router;
