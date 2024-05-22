import { Router } from "express";

import passport from "../passport";
import validateResource from "../middleware/validateResource";
import {
  changePassword,
  resetPassword,
  sendOTPAndRecoverEmailSchema,
  signinSchema,
  signupSchema,
  verifyEmailSchema,
} from "../schemas/user.schema";
import AuthController from "../controllers/auth.controller";
import configs from "../configs";
import { rateLimitRecover, rateLimitSentOtp } from "../middleware/rateLimit";
import { requiredAuth } from "../middleware/requiredAuth";

const SUCCESS_REDIRECT = `${configs.CLIENT_URL}/manager`;
const FAILURE_REDIRECT = `${configs.CLIENT_URL}/auth/signin/error`;

class AuthRoutes {
  routes = Router();
  private controller = new AuthController();

  constructor() {
    this.intializeRoutes();
  }
  private intializeRoutes() {
    this.routes.get(
      "/github",
      passport.authenticate("github", {
        scope: ["user:email"],
      })
    );

    this.routes.get(
      "/github/callback",
      passport.authenticate("github", {
        failureMessage: "Cannot login to github, please try again later!",
        failureRedirect: FAILURE_REDIRECT,
        successRedirect: SUCCESS_REDIRECT,
      })
    );

    this.routes.get(
      "/google",
      passport.authenticate("google", {
        scope: ["profile", "email"],
      })
    );

    this.routes.get(
      "/google/callback",
      passport.authenticate("google", {
        failureMessage: "Cannot login to google, please try again later!",
        failureRedirect: FAILURE_REDIRECT,
        successRedirect: SUCCESS_REDIRECT,
      })
    );

    this.routes.post(
      "/signin",
      validateResource(signinSchema),
      passport.authenticate("local"),
      this.controller.signIn
    );

    this.routes.post(
      "/signup",
      validateResource(signupSchema),
      this.controller.signUp
    );

    // this.routes.post(
    //   "/signup/send-otp",
    //   rateLimitSentOtp,
    //   validateResource(sendOTPAndRecoverEmailSchema),
    //   this.controller.sendOTP
    // );

    this.routes.get(
      "/confirm_email/:token",
      validateResource(verifyEmailSchema),
      this.controller.verifyEmail
    );

    this.routes.patch(
      "/recover",
      rateLimitRecover,
      validateResource(sendOTPAndRecoverEmailSchema),
      this.controller.recover
    );

    this.routes.patch(
      "/reset-password/:token",
      validateResource(resetPassword),
      this.controller.resetPassword
    );

    this.routes.patch(
      "/change-password",
      requiredAuth,
      validateResource(changePassword),
      this.controller.changPassword
    );

    this.routes.delete("/signout", this.controller.signOut);
  }
}
export default new AuthRoutes().routes;
