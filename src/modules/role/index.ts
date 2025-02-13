import { Router } from "express";
import roleV1Routes from "./v1/role.routes";

const router = Router();

router.use("/v1", roleV1Routes);

export default router;
