import { Router } from "express";
import UserController from "../controllers/user.controller";
import { checkActive, requiredAuth } from "../middleware/requiredAuth";
import { rateLimitSendEmail } from "../middleware/rateLimit";
import validateResource from "../middleware/validateResource";
import { changePassword, editProfileSchema } from "../schemas/user.schema";

class UserRoutes {
  routes = Router();
  private controller = new UserController();

  constructor() {
    this.intializeRoutes();
  }

  intializeRoutes() {
    this.routes.get(
      "/me",
      requiredAuth,
      checkActive,
      this.controller.currentUser
    );
    this.routes.get("/token/:token", this.controller.getUserByToken);
    this.routes.get(
      "/send-verify-email",
      requiredAuth,
      checkActive,
      rateLimitSendEmail,
      this.controller.sendVerifyEmail
    );
    this.routes.patch(
      "/change-email",
      requiredAuth,
      checkActive,
      this.controller.changeEmail
    );
    this.routes.patch(
      "/",
      requiredAuth,
      checkActive,
      validateResource(editProfileSchema),
      this.controller.edit
    );
    this.routes.patch(
      "/change-password",
      requiredAuth,
      checkActive,
      validateResource(changePassword),
      this.controller.changPassword
    );
    this.routes.delete("/disable", requiredAuth, this.controller.disableActive);
  }
}

export default new UserRoutes().routes;
