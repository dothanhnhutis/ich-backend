import { StatusCodes } from "http-status-codes";

export class AppError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class BadRequestError extends AppError {
  constructor(public message: string) {
    super(StatusCodes.BAD_REQUEST, message);
  }
}

export class NotAuthorizedError extends AppError {
  constructor(message = "Authentication failed") {
    super(StatusCodes.UNAUTHORIZED, message);
  }
}

export class NotFoundError extends AppError {
  constructor(message = "Resource not found") {
    super(StatusCodes.NOT_FOUND, message);
  }
}

export class PermissionError extends AppError {
  constructor(message = "Permission denied") {
    super(StatusCodes.FORBIDDEN, message);
  }
}

export class CacheError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class ConnectCacheError extends CacheError {
  constructor(public message: string) {
    super(600, message);
  }
}

export class QueryCacheError extends CacheError {
  constructor(public message: string) {
    super(601, message);
  }
}

export class MBError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

export class ConnectMBError extends MBError {
  constructor() {
    super(700, "Connection to the RabbitMQ cluster failed");
  }
}
