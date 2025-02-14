import * as z from "zod";
import { CookieOptions } from "express";
import UAParser from "ua-parser-js";

export const signInSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: "Email là trường bắt buộc",
          invalid_type_error: "Email phải là chuỗi",
        })
        .email("Email và mật khẩu không hợp lệ"),
      password: z
        .string({
          required_error: "Mật khẩu là trường bắt buộc",
          invalid_type_error: "Mật khẩu phải là chuỗi",
        })
        .min(8, "Email và mật khẩu không hợp lệ")
        .max(40, "Email và mật khẩu không hợp lệ"),
    })
    .strict(),
});

export type SignInReq = z.infer<typeof signInSchema>;

type UserStatus = "ACTIVE" | "SUSPENDED" | "LOCKED";
type UserGender = "MALE" | "FEMALE" | "OTHER" | null;

export type User = {
  id: string;
  email: string;
  emailVerified: Date | null;
  status: UserStatus;
  passwordHash: string | null;
  name: string;
  birthDate: string | null;
  gender: UserGender;
  image: string | null;
  phoneNumber: string | null;
  createdAt: Date;
  updatedAt: Date;
};

export type UserAttributeFilterProps = User & {
  emailVerificationExpires: Date | null;
  emailVerificationToken: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: Date | null;
  reActiveToken: string | null;
  reActiveExpires: Date | null;
};

export type MFA = {
  userId: string;
  secretKey: string;
  lastAccess: Date;
  createdAt: Date;
  updatedAt: Date;
};

export type CreateSession = {
  userId: string;
  reqInfo: {
    ip: string;
    userAgentRaw: string;
  };
  cookie?: CookieOptions;
};

export type SessionData = {
  id: string;
  userId: string;
  cookie: CookieOptions;
  reqInfo: {
    ip: string;
    userAgent: UAParser.IResult;
    userAgentRaw: string;
    lastAccess: Date;
    createAt: Date;
  };
};
