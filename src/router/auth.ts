import { Router } from "express";

import passport from "../passport";
import validateResource from "../middleware/validateResource";
import {
  sendOTPSchema,
  signinSchema,
  signupSchema,
} from "../schemas/user.schema";
import AuthController from "../controllers/auth";
import configs from "../configs";
import { rateLimitSentOtp } from "../middleware/rateLimit";

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

    this.routes.get("/me", function (req, res) {
      console.log(req.session);
      console.log(req.isAuthenticated());
      console.log(req.user);
      res.send("oke");
    });

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
    this.routes.post(
      "/signup/send-otp",
      // rateLimitSentOtp,
      validateResource(sendOTPSchema),
      this.controller.sendOTP
    );

    this.routes.get("/signout", this.controller.signOut);
  }
}
export default new AuthRoutes().routes;
