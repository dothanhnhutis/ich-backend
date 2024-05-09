import { Router } from "express";
import { StatusCodes } from "http-status-codes";

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
      "/google",
      passport.authenticate("google", {
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
      })
    );

    this.routes.get(
      "/google/callback",
      passport.authenticate("google"),
      function (req, res) {
        console.log(req.session);
        // Successful authentication, redirect home.
        res.redirect("/api/v1");
      }
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
