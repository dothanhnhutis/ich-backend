import { Router } from "express";
import SessionController from "../controllers/session.controller";
import { checkActive, requiredAuth } from "../middleware/requiredAuth";
class SessionRoutes {
  routes = Router();
  private controller = new SessionController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.routes.get(
      "/",
      requiredAuth,
      checkActive,
      this.controller.getAllSession
    );
  }
}

export default new SessionRoutes().routes;
