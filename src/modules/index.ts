import { Router } from "express";
import userRoutes from "./user";
import locationRoutes from "./location";

const router = Router();

router.use("/users", userRoutes);
router.use("/locations", locationRoutes);

export default router;
