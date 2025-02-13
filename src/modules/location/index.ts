import { Router } from "express";
import locationV1Routes from "./v1/location.routes";

const router = Router();

router.use("/v1", locationV1Routes);

export default router;
