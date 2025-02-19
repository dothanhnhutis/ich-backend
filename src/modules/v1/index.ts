import { Router } from "express";
import userRoutes from "./user/user.routes";
import locationRoutes from "./location/location.routes";
import roleRoutes from "./role/role.routes";
import displayRoutes from "./display";
import productRoutes from "./product/product.routes";

const router = Router();

router.use("/users", userRoutes);
router.use("/locations", locationRoutes);
router.use("/roles", roleRoutes);
router.use("/displays", displayRoutes);
router.use("/products", productRoutes);

export default router;
