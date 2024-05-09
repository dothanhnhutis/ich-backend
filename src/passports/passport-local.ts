import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import prisma from "../utils/db";
import { BadRequestError } from "../error-handler";
import { omit } from "lodash";
import { User } from "../schemas/user.schema";

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

      if (!user.password || user.password !== password)
        return done(
          new BadRequestError("Invalid email or password"),
          undefined
        );

      return done(null, omit(user, ["password", "createdAt", "updatedAt"]));
    }
  )
);

passport.serializeUser<User>((user: any, done) => {
  console.log(1);
  console.log(user);
  done(null, user);
});

passport.deserializeUser<User>(async (id, done) => {
  console.log(2);
  console.log(id);
  try {
    if (!true) throw new Error("User Not Found");
    done(null, "asdsad");
  } catch (err) {
    done(err, null);
  }
});

export default passport;
