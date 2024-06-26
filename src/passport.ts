import passport from "passport";
import crypto from "crypto";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import prisma from "./utils/db";
import { BadRequestError } from "./error-handler";
import configs from "./configs";
import { compareData } from "./utils/helper";
import userAgentParse, { IDevice } from "ua-parser-js";
import { redisClient } from "./redis/connection";
import { UserRole } from "./schemas/user.schema";
const GoogleCallbackURL = `${configs.SERVER_URL}/api/v1/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: configs.GOOGLE_CLIENT_ID,
      clientSecret: configs.GOOGLE_CLIENT_SECRET,
      callbackURL: GoogleCallbackURL,
      passReqToCallback: true,
    },
    async function (req, accessToken, refreshToken, profile, done) {
      const userAgent = userAgentParse(req.headers["user-agent"]);
      let userProvider = await prisma.linkProvider.findUnique({
        where: {
          provider_providerId: {
            provider: profile.provider,
            providerId: profile.id,
          },
        },
        include: {
          user: {
            select: {
              id: true,
              role: true,
              isBlocked: true,
              emailVerified: true,
            },
          },
        },
      });

      if (!userProvider) {
        const randomBytes: Buffer = await Promise.resolve(
          crypto.randomBytes(20)
        );
        const randomCharacters: string = randomBytes.toString("hex");
        const user = await prisma.user.create({
          data: {
            email: profile._json.email!,
            emailVerificationToken: randomCharacters,
            emailVerified: true,
            username: profile._json.name!,
            picture: profile._json.picture,
          },
        });
        userProvider = await prisma.linkProvider.create({
          data: {
            provider: profile.provider,
            providerId: profile._json.sub,
            user: {
              connect: {
                id: user.id,
              },
            },
          },
          include: {
            user: {
              select: {
                id: true,
                role: true,
                isBlocked: true,
                emailVerified: true,
              },
            },
          },
        });
      }

      if (userProvider.user.isBlocked)
        return done(
          new BadRequestError(
            "Your account has been locked please contact the administrator"
          ),
          undefined
        );
      return done(null, {
        ...userProvider.user,
        userAgent: userAgent.ua,
        device: userAgent.device,
      });
    }
  )
);

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
      passReqToCallback: true,
    },
    async function (req, email, password, done) {
      const userAgent = userAgentParse(req.headers["user-agent"]);
      const user = await prisma.user.findUnique({
        where: {
          email,
        },
      });
      if (!user)
        return done(
          new BadRequestError("Invalid email or password"),
          undefined
        );

      if (!user.password || !(await compareData(user.password, password)))
        return done(
          new BadRequestError("Invalid email or password"),
          undefined
        );

      if (user.isBlocked)
        return done(
          new BadRequestError(
            "Your account has been locked please contact the administrator"
          ),
          undefined
        );

      return done(null, {
        id: user.id,
        role: user.role,
        isBlocked: user.isBlocked,
        emailVerified: user.emailVerified,
        userAgent: userAgent.ua,
        device: userAgent.device,
      });
    }
  )
);

export interface ISessionDataStore {
  id: string;
  role: UserRole;
  emailVerified: boolean;
  isBlocked: boolean;
  userAgent: string;
  device: IDevice;
}

passport.serializeUser<any>((user, done) => {
  done(null, user);
});

passport.deserializeUser<any>(async (user, done) => {
  try {
    const userExist = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        role: true,
        isBlocked: true,
        emailVerified: true,
      },
    });
    done(null, { ...user, ...userExist });
  } catch (error) {
    done(error, undefined);
  }
});

export default passport;
