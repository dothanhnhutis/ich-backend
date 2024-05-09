import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import configs from "../configs";

passport.serializeUser<string>((user: any, done) => {
  // console.log("user: " + user);
  console.log(1);
  console.log(user);
  done(null, user);
});

interface A {}

passport.deserializeUser<A>(async (id, done) => {
  console.log(2);
  console.log(id);
  try {
    if (!true) throw new Error("User Not Found");
    done(null, "asdsad");
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: configs.GOOGLE_CLIENT_ID,
      clientSecret: configs.GOOGLE_CLIENT_SECRET,
      callbackURL: `http://localhost:4000/api/v1/auth/google/callback`,
    },
    function (accessToken: any, refreshToken: any, profile: any, done: any) {
      console.log(3);
      console.log(accessToken);
      console.log(refreshToken);
      console.log(profile);
      return done(null, { id: 12312 });
    }
  )
);

export default passport;
