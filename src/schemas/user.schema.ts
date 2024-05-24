import { query } from "express";
import z from "zod";

export const signinSchema = z.object({
  body: z
    .object({
      email: z
        .string({
          required_error: "email field is required",
          invalid_type_error: "email field must be string",
        })
        .email("invalid email or password"),
      password: z
        .string({
          required_error: "password field is required",
          invalid_type_error: "password field must be string",
        })
        .min(8, "invalid email or password")
        .max(40, "invalid email or password"),
    })
    .strict(),
});

export const signupSchema = z.object({
  body: z
    .object({
      username: z
        .string({
          required_error: "Username field is required",
          invalid_type_error: "Username field must be string",
        })
        .min(1, "Username can't be empty"),
      email: z
        .string({
          required_error: "Email field is required",
          invalid_type_error: "Email field must be string",
        })
        .email("Invalid email"),
      password: z
        .string({
          required_error: "Password field is required",
          invalid_type_error: "Password field must be string",
        })
        .min(8, "Password field is too short")
        .max(40, "Password field can not be longer than 40 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
          "Password field must include: letters, numbers and special characters"
        ),
      // code: z
      //   .string({
      //     required_error: "Code field is required",
      //     invalid_type_error: "Code field must be string",
      //   })
      //   .length(6, "Code field include 6 characters"),
    })
    .strict(),
});

export const sendRecoverEmailSchema = z.object({
  body: signupSchema.shape.body
    .pick({
      email: true,
    })
    .strict(),
});

export const verifyEmailSchema = z.object({
  params: z.object({
    token: z.string(),
  }),
});

export const resetPassword = z.object({
  params: z.object({
    token: z.string(),
  }),
  body: z
    .object({
      password: z
        .string({
          required_error: "Password field is required",
          invalid_type_error: "Password field must be string",
        })
        .min(8, "Password field is too short")
        .max(40, "Password field can not be longer than 40 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
          "Password field must include: letters, numbers and special characters"
        ),
      confirmPassword: z.string(),
    })
    .strict()
    .refine((data) => data.password === data.confirmPassword, {
      message: "Passwords don't match",
      path: ["confirmPassword"],
    }),
});

export const changePassword = z.object({
  body: z
    .object({
      currentPassword: z.string(),
      newPassword: z
        .string({
          required_error: "Password field is required",
          invalid_type_error: "Password field must be string",
        })
        .min(8, "Password field is too short")
        .max(40, "Password field can not be longer than 40 characters")
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]*$/,
          "Password field must include: letters, numbers and special characters"
        ),
      confirmNewPassword: z.string(),
    })
    .strict()
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: "Confirm new password don't match",
      path: ["confirmNewPassword"],
    })
    .refine((data) => data.currentPassword === data.newPassword, {
      message: "The new password and old password must not be the same",
      path: ["confirmNewPassword"],
    }),
});

export type User = {
  id: string;
  email: string | null;
  userProviderId: string | null;
  provider: string;
  username: string;
  picture: string | null;
  passwordResetToken: string | null;
  passwordResetExpires: string | null;
  role: UserRole;
  isBlocked: string;
  createdAt: string;
  updatedAt: string;
};
export type SignIn = z.infer<typeof signinSchema>;
export type SignUp = z.infer<typeof signupSchema>;
export type SendRecoverEmail = z.infer<typeof sendRecoverEmailSchema>;

export type VerifyEmail = z.infer<typeof verifyEmailSchema>;
export type ResetPassword = z.infer<typeof resetPassword>;
export type ChangePassword = z.infer<typeof changePassword>;
export type CurrentUser = {
  id: string;
  email: string | null;
  username: string;
  role: UserRole;
  picture: string | null;
  emailVerified: boolean;
  isBlocked: string;
};

export type UserRole = "ADMIN" | "MANAGER" | "SALER" | "WRITER" | "CUSTOMER";
