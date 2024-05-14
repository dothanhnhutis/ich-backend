import { Router } from "express";
import UserController from "../controllers/user.controller";
import { requiredAuth } from "../middleware/requiredAuth";

class UserRoutes {
  routes = Router();
  private controller = new UserController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.routes.get("/me", requiredAuth, this.controller.currentUser);
    this.routes.get("/token/:token", this.controller.getUserByToken);
  }
}

export default new UserRoutes().routes;
