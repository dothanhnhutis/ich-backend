import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as GithubStrategy } from "passport-github2";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import prisma from "./utils/db";
import { BadRequestError } from "./error-handler";
import configs from "./configs";
import { omit } from "lodash";
import { compareData } from "./utils/helper";
import { User } from "./schemas/user.schema";

const GoogleCallbackURL = `${configs.SERVER_URL}/api/v1/auth/google/callback`;
const GitHubCallbackURL = `${configs.SERVER_URL}/api/v1/auth/github/callback`;

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
      // const user = await prisma..findUnique({
      //   where: {
      //     provider_userProviderId: {
      //       provider: "google",
      //       userProviderId: "115454504953036967354",
      //     },
      //   },
      // });
      return done(null, { id: 12312 });
    }
  )
);

passport.use(
  new GithubStrategy(
    {
      clientID: configs.GITHUB_CLIENT_ID,
      clientSecret: configs.GITHUB_CLIENT_SECRET,
      callbackURL: GitHubCallbackURL,
    },
    async function (
      accessToken: any,
      refreshToken: any,
      profile: any,
      done: any
    ) {
      // const user = await prisma.user.findUnique({
      //   where: {
      //     AND: { provider: "google", userProviderId: "115454504953036967354" },
      //   },
      // });

      console.log(profile);
      return done(null, { id: 12312 });
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

      return done(null, omit(user, ["password", "createdAt", "updatedAt"]));
    }
  )
);

passport.serializeUser<Omit<User, "password" | "createdAt" | "updatedAt">>(
  (user: any, done) => {
    done(null, user);
  }
);

passport.deserializeUser<Omit<User, "password" | "createdAt" | "updatedAt">>(
  async (user, done) => {
    done(null, user);
  }
);

export default passport;
