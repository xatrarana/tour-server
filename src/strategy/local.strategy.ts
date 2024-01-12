import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { IUserDocument, IUserResponse } from "../utils/types";


passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id: string, done) => {
  try {
    const user = await User.findById(_id);
    if (!user) throw new Error("user not found");
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

export default passport.use(
  new Strategy(async (username, password, done) => {
    try {
      const user: IUserResponse  = await User.findOne({ username }).select("+password");
      if (!user) {
        throw new ApiError(403, "Invalid credentials.",[{params: "no user found."}]);
      }
      const isValidPassword = await user.isPasswordCorrect(password);
      if (!isValidPassword) {
        throw new ApiError(403, "Invalid credentials.",[{params: "password is incorrect."}]);
      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }),
);
