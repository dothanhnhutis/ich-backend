import { Router } from "express";
import roomV1Routes from "./v1/room.routes";

const router = Router();

router.use("/v1", roomV1Routes);

export default router;
