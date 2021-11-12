import passport from "passport";
import GoogleStrategy from "passport-google-oauth20";
import { Token } from "../types/user.js";
import UserModel from "../users/schema.js";
import { generateTokens } from "./jwt.js";

const googleStrategy = new GoogleStrategy.Strategy(
  {
    clientID: process.env.GOOGLE_OAUTH_ID,
    clientSecret: process.env.GOOGLE_OAUTH_SECRET,
    callbackURL: `${process.env.API_URL}/googleRedirect`
  },
  async (
    accessToken: Token,
    refreshToken: Token,
    googleProfile,
    passportNext
  ) => {
    try {
      const user = await UserModel.findOne({ googleId: googleProfile.id });
      if (user) {
        const tokens = await generateTokens(user);
        passportNext(null, { tokens });
      } else {
        if (googleProfile.name && googleProfile.emails) {
          const newUser = {
            name: googleProfile.name.givenName,
            surname: googleProfile.name.familyName,
            email: googleProfile.emails[0].value,
            googleId: googleProfile.id
          };
          const createdUser = new UserModel(newUser);
          const tokens = await generateTokens(createdUser);
          passportNext(null, { tokens });
        } else new Error("Missing google account information");
      }
    } catch (error: any) {
      passportNext(error);
    }
  }
);

passport.serializeUser(function (data, passportNext) {
  passportNext(null, data);
});

export default googleStrategy;
