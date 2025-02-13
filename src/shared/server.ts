import "express-async-errors";
import express, { Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import http from "http";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import env from "./configs/env";
import { AppError, NotFoundError } from "./error-handler";
import { StatusCodes } from "http-status-codes";
import moduleRoutes from "@/modules";
import logger from "./logger";
import { connectCache } from "./cache/connect";
import deserializeCookie from "./middlewares/deserializeCookie";
import deserializeUser from "./middlewares/deserializeUser";
const SERVER_PORT = 4000;

export default class Server {
  static build() {
    const server: Express = express();
    server.set("trust proxy", 1);
    server.use(
      morgan("combined", {
        stream: {
          write: (message: string) => logger.info(message.trim()),
        },
      })
    );

    server.use(helmet());
    server.use(
      cors({
        origin: env.CLIENT_URL,
        credentials: true,
        methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
      })
    );

    server.use(compression());
    server.use(express.json({ limit: "200mb" }));
    server.use(express.urlencoded({ extended: true, limit: "200mb" }));

    server.use(deserializeCookie);
    server.use(deserializeUser);

    server.use("/api", moduleRoutes);

    server.use("*", (req, res, next) => {
      throw new NotFoundError();
    });

    server.use(
      (error: unknown, req: Request, res: Response, next: NextFunction) => {
        if (error instanceof AppError) {
          return res.status(error.statusCode).json({
            status: error.statusCode,
            success: false,
            message: error.message,
            data: null,
          });
        }
        logger.debug(error);
        return res
          .status(StatusCodes.INTERNAL_SERVER_ERROR)
          .send({ message: "Something went wrong" });
      }
    );
    return server;
  }

  static startHttpServer(httpServer: http.Server) {
    try {
      logger.info(`Server has started with process id ${process.pid}`);
      httpServer.listen(SERVER_PORT, () => {
        logger.info(`Server running on port ${SERVER_PORT}`);
      });
    } catch (error) {
      logger.error("Server.startHttpServer() method error:", error);
    }
  }

  static startServer() {
    try {
      const server = Server.build();
      const httpServer: http.Server = new http.Server(server);

      connectCache();

      Server.startHttpServer(httpServer);
    } catch (error) {
      logger.error("Server.startServer() error method:", error);
    }
  }
}
