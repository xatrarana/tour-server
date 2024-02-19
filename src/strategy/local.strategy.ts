import passport from "passport";
import { Strategy } from "passport-local";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import {  IUserResponse } from "../utils/types";


passport.serializeUser((user: any, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (_id: string, done) => {
  try {
    const user = await User.findById(_id);
    if (!user) return done(new ApiError(404, "User not found"));
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

export default passport.use(
  new Strategy(async (username:string, password:string, done) => {
    try {
      const user: IUserResponse  = await User.findOne({ username }).select("+password");
      if (!user) {
        return done(new ApiError(400,"Invalid Credentials",[{params:"username",message:"Incorrect Username"}]), false)
      }
      const isValidPassword = await user.isPasswordCorrect(password);
      if (!isValidPassword) {
        return done(new ApiError(400,"Invalid Credentials",[{params:"password",message:"Incorrect Password"}]), false)

      }
      done(null, user);
    } catch (error) {
      done(error, false);
    }
  }),
);


