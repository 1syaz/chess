import passport from "passport";
import config from "./config";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ApiErrorResponse } from "../utils/ApiErrorResponse";
import { User } from "../models/userModel";

passport.use(
  new GoogleStrategy(
    {
      clientID: config.GOOGLE_CLIENT_ID,
      clientSecret: config.GOOGLE_CLIENT_SECRET,
      callbackURL:
        config.DEV_ENV === "development"
          ? `${config.DEV_CLIENT_URL}/api/v1/users/google/callback`
          : `${config.PROD_CLIENT_URL}/api/v1/users/google/callback`,
      scope: ["profile", "email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      const googleUser = profile._json;
      const { email, picture, given_name, sub } = googleUser;

      const user = await User.findOne({ email });

      if (!user) {
        await User.create({
          name: given_name,
          email,
          avatar: picture,
          googleId: sub,
        });
      } else if (!user.googleId) {
        throw new ApiErrorResponse(
          409,
          "This email is already registered with password authentication. Please login with your password."
        );
      }

      return done(null, googleUser);
    }
  )
);
