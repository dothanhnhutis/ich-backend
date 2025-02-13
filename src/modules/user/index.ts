import { Router } from "express";
import userV1Routes from "./v1/user.routes";

const router = Router();

router.use("/v1", userV1Routes);

export default router;
