import { Router } from "express";

import passport from "../passport";
import validateResource from "../middleware/validateResource";
import { signinSchema } from "../schemas/user.schema";
import AuthController from "../controllers/auth";

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
        failureRedirect: "http://localhost:3000/auth/signin/error",
        successRedirect: "http://localhost:3000/auth/signin/success",
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
        failureRedirect: "http://localhost:3000/auth/signin/error",
        successRedirect: "http://localhost:3000/auth/signin/success",
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
    this.routes.get("/signout", this.controller.signOut);
  }
}
export default new AuthRoutes().routes;
