import { Router } from "express";
import userRoutes from "./user/user.routes";
import locationRoutes from "./location/location.routes";
import roleRoutes from "./role/role.routes";
import roomRoutes from "./room/room.routes";
import displayRoutes from "./display/display.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/locations", locationRoutes);
router.use("/roles", roleRoutes);
router.use("/rooms", roomRoutes);
router.use("/displays", displayRoutes);

export default router;
