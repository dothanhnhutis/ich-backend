import "express-async-errors";
import "./types";
import http from "http";
import express, { Request, Response, NextFunction, Application } from "express";
import cors from "cors";
import morgan from "morgan";
import routes from "./router";
import { IErrorResponse, NotFoundError } from "./error-handler";
import { CustomError } from "./error-handler";
import helmet from "helmet";
import configs from "./configs";
import { StatusCodes } from "http-status-codes";
import compression from "compression";
import passport from "./passport";
import { initRedis, redisClient } from "./redis/connection";
import session from "express-session";
import RedisStore from "connect-redis";

const SERVER_PORT = 4000;
const SESSION_MAX_AGE = 1000 * 60 * 60 * 24 * 90;

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
    initRedis();

    app.use(
      session({
        store: new RedisStore({
          client: redisClient,
          prefix: "sess:",
          disableTouch: false,
        }),
        name: configs.SESSION_KEY_NAME,
        secret: configs.SESSION_SECRET,
        saveUninitialized: false,
        resave: false,
        cookie: {
          httpOnly: true,
          secure: configs.NODE_ENV == "production",
          maxAge: SESSION_MAX_AGE,
        },
        genid: (req) => {
          return `${req.user?.id}:${Math.random().toString(36).substring(2)}`;
        },
      })
    );
    app.use(passport.initialize());
    app.use(passport.session());

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
          if (error.statusCode == StatusCodes.UNAUTHORIZED) {
            res.clearCookie("session");
          }
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
