import { Router } from "express";
import UserController from "../controllers/user.controller";
import { requiredAuth } from "../middleware/requiredAuth";
import { rateLimitSendEmail } from "../middleware/rateLimit";

class UserRoutes {
  routes = Router();
  private controller = new UserController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.routes.get("/me", requiredAuth, this.controller.currentUser);
    this.routes.get("/token/:token", this.controller.getUserByToken);
    this.routes.get(
      "/send-verify-email",
      rateLimitSendEmail,
      this.controller.sendVerifyEmail
    );
    this.routes.patch("/change-email", this.controller.changeEmail);
  }
}

export default new UserRoutes().routes;
