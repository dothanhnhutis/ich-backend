import { Request } from "express";
import { rateLimit } from "express-rate-limit";

export const rateLimitEmail = rateLimit({
  windowMs: 1 * 60000,
  limit: 1,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: function (req: Request<{}, {}, { email: string }>) {
    return req.body.email;
  },
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json({ message: options.message });
  },
});

export const rateLimitUserId = rateLimit({
  windowMs: 60000,
  limit: 1,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: function (req: Request) {
    const currentUser = req.user!;
    return currentUser.id;
  },
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json({ message: options.message });
  },
});
