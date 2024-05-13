import { Request } from "express";
import { rateLimit } from "express-rate-limit";
import { CreateContact } from "../schemas/contact.schema";
import { SendOTP, SignUp } from "../schemas/user.schema";

export const rateLimitContact = rateLimit({
  windowMs: 60 * 1000,
  limit: 2,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: function (req: Request<{}, {}, CreateContact["body"]>) {
    return req.body.requestId;
  },
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json({ message: options.message });
  },
});

export const rateLimitSentOtp = rateLimit({
  windowMs: 60 * 1000,
  limit: 1,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  keyGenerator: function (req: Request<{}, {}, SendOTP["body"]>) {
    return req.body.email;
  },
  handler: (req, res, next, options) => {
    return res.status(options.statusCode).json({ message: options.message });
  },
});
