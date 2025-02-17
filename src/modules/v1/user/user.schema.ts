import * as z from "zod";
import { CookieOptions } from "express";
import UAParser from "ua-parser-js";

export const signInSchema = z.object({
  body: z
    .object({
      email: z.string({
        required_error: "Email là trường bắt buộc",
        invalid_type_error: "Email phải là chuỗi",
      }),
      password: z.string({
        required_error: "Mật khẩu là trường bắt buộc",
        invalid_type_error: "Mật khẩu phải là chuỗi",
      }),
    })
    .strict(),
});

export type SignInReq = z.infer<typeof signInSchema>;

type UserStatus = "ACTIVE" | "SUSPENDED" | "LOCKED";
type UserGender = "MALE" | "FEMALE" | "OTHER" | null;

export type User = {
  id: string;
  email: string;
  email_verified: Date | null;
  status: UserStatus;
  password_hash: string | null;
  name: string;
  birth_date: string | null;
  gender: UserGender;
  image: string | null;
  phone_number: string | null;
  created_at: Date;
  updated_at: Date;
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
  user_id: string;
  secret_key: string;
  last_access: Date;
  created_at: Date;
  updated_at: Date;
};

export type CreateSession = {
  user_id: string;
  req_info: {
    ip: string;
    user_agent_raw: string;
  };
  cookie?: CookieOptions;
};

export type SessionData = {
  id: string;
  user_id: string;
  cookie: CookieOptions;
  req_info: {
    ip: string;
    user_agent: UAParser.IResult;
    user_agent_raw: string;
    last_access: Date;
    create_at: Date;
  };
};
