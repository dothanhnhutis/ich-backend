import { Router } from "express";
import { StatusCodes } from "http-status-codes";

import passportGoogle from "../passports/passport-google";
import passportLocal from "../passports/passport-local";
import validateResource from "../middleware/validateResource";
import { signinSchema } from "../schemas/user.schema";

class AuthRoutes {
  routes = Router();
  constructor() {
    this.intializeRoutes();
  }
  private intializeRoutes() {
    this.routes.get(
      "/google",
      passportGoogle.authenticate("google", {
        scope: [
          "https://www.googleapis.com/auth/userinfo.profile",
          "https://www.googleapis.com/auth/userinfo.email",
        ],
      })
    );

    this.routes.get(
      "/google/callback",
      passportGoogle.authenticate("google", { failureRedirect: "/login" }),
      function (req, res) {
        console.log(req.session);
        // Successful authentication, redirect home.
        res.redirect("/api/v1");
      }
    );

    this.routes.get("/me", function (req, res) {
      console.log(req.session);
      console.log(req.isAuthenticated());
      // Successful authentication, redirect home.
      res.send("oke");
    });

    this.routes.post(
      "/signin",
      validateResource(signinSchema),
      passportLocal.authenticate("local"),
      (req, res) => {
        res.status(StatusCodes.OK).json({
          message: "Signin successful",
        });
      }
    );
  }
}
export default new AuthRoutes().routes;
