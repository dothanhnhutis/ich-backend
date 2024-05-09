import "express-async-errors";
import http from "http";
import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import morgan from "morgan";
import session from "express-session";
import routes from "./router";
import { IErrorResponse, NotFoundError } from "./error-handler";
import { CustomError } from "./error-handler";
import helmet from "helmet";
import configs from "./configs";
import { StatusCodes } from "http-status-codes";
import compression from "compression";
import { createRedisStore } from "./redis";
import passportGithub from "./passports/passport-github";
import passportGoogle from "./passports/passport-github";
import passportLocal from "./passports/passport-local";

const SERVER_PORT = 4000;
const SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 180;

export default class AppServer {
  private app: Application;

  constructor(app: Application) {
    this.app = app;
  }

  public start(): void {
    this.securityMiddleware(this.app);
    this.standardMiddleware(this.app);
    this.routesMiddleware(this.app);
    this.errorHandler(this.app);
    this.startServer(this.app);
  }

  private standardMiddleware(app: Application): void {
    app.use(compression());
    app.use(express.json({ limit: "200mb" }));
    app.use(express.urlencoded({ extended: true, limit: "200mb" }));
  }

  private securityMiddleware(app: Application): void {
    app.set("trust proxy", 1);
    const redisStore = createRedisStore();

    this.app.use(
      session({
        name: configs.SESSION_KEY_NAME,
        resave: false,
        saveUninitialized: false,
        secret: configs.SESSION_SECRET,
        cookie: {
          httpOnly: true,
          secure: configs.NODE_ENV == "production",
          maxAge: SESSION_MAX_AGE,
        },
        store: redisStore,
      })
    );
    app.use(passportGithub.initialize());
    app.use(passportGithub.session());

    app.use(passportGoogle.initialize());
    app.use(passportGoogle.session());

    app.use(passportLocal.initialize());
    app.use(passportLocal.session());

    this.app.use(morgan(configs.NODE_ENV == "production" ? "combined" : "dev"));
    app.use(helmet());
    this.app.use(
      cors({
        origin: configs.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      })
    );
  }

  private routesMiddleware(app: Application): void {
    // middleware
    // this.app.use(deserializeUser);
    // routes
    this.app.use("/api/v1", routes);
  }

  private errorHandler(app: Application): void {
    // handle 404
    app.use("*", (req: Request, res: Response, next: NextFunction) => {
      throw new NotFoundError();
    });
    // handle error
    app.use(
      (
        error: IErrorResponse,
        _req: Request,
        res: Response,
        next: NextFunction
      ) => {
        if (error instanceof CustomError) {
          return res.status(error.statusCode).json(error.serializeErrors());
        }
        console.log(error);
        // req.session.destroy(function (err) {});
        // res.clearCookie("session");
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Something went wrong" });
      }
    );
  }

  private async startServer(app: Application) {
    try {
      const httpServer: http.Server = new http.Server(app);
      this.startHttpServer(httpServer);
    } catch (error) {
      console.log("GatewayService startServer() error method:", error);
    }
  }

  private startHttpServer(httpServer: http.Server) {
    try {
      console.log(`App server has started with process id ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        console.log(`App server running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      console.log("AppService startServer() method error:", error);
    }
  }
}
