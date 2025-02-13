import { Router } from "express";
import displayV1Routes from "./v1/display.routes";

const router = Router();

router.use("/v1", displayV1Routes);

export default router;
