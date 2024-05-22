import passport from "passport";
import crypto from "crypto";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import prisma from "./utils/db";
import { BadRequestError } from "./error-handler";
import configs from "./configs";
import { compareData } from "./utils/helper";
import { pick } from "lodash";
import { CurrentUser } from "./schemas/user.schema";

const GoogleCallbackURL = `${configs.SERVER_URL}/api/v1/auth/google/callback`;

passport.use(
  new GoogleStrategy(
    {
      clientID: configs.GOOGLE_CLIENT_ID,
      clientSecret: configs.GOOGLE_CLIENT_SECRET,
      callbackURL: GoogleCallbackURL,
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
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
              email: true,
              username: true,
              role: true,
              picture: true,
              emailVerified: true,
              isBlocked: true,
            },
          },
        },
      });
      console.log(userProvider);

      if (!userProvider) {
        const randomBytes: Buffer = await Promise.resolve(
          crypto.randomBytes(20)
        );
        const randomCharacters: string = randomBytes.toString("hex");
        const user = await prisma.user.create({
          data: {
            email: profile._json.email,
            emailVerificationToken: randomCharacters,
            emailVerified: true,
            username: profile._json.name,
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
                email: true,
                username: true,
                role: true,
                picture: true,
                emailVerified: true,
                isBlocked: true,
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
      return done(null, userProvider.user);
    }
  )
);

passport.use(
  new LocalStrategy(
    { usernameField: "email", passwordField: "password" },
    async function (email, password, done) {
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
      if (user.isBlocked)
        return done(
          new BadRequestError(
            "Your account has been locked please contact the administrator"
          ),
          undefined
        );

      if (!user.password || !(await compareData(user.password, password)))
        return done(
          new BadRequestError("Invalid email or password"),
          undefined
        );

      return done(
        null,
        pick(user, [
          "id",
          "email",
          "username",
          "role",
          "picture",
          "emailVerified",
          "isBlocked",
        ])
      );
    }
  )
);

passport.serializeUser<CurrentUser>((user: any, done) => {
  done(null, user);
});

passport.deserializeUser<CurrentUser>(async (user, done) => {
  console.log(user);
  try {
    const userExist = await prisma.user.findUnique({
      where: { id: user.id },
      select: {
        id: true,
        email: true,
        username: true,
        role: true,
        picture: true,
        isBlocked: true,
        emailVerified: true,
      },
    });
    done(null, userExist);
  } catch (error) {
    done(error, undefined);
  }
});

export default passport;
