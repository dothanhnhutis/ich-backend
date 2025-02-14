import { Router } from "express";
import displayOrderRoutes from "./order/display.routes";
const router = Router();

router.use("/orders", displayOrderRoutes);

export default router;
