import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import {
  ROLE,
  type IUserDocument,
  type IUser,
  type TUserModel,
} from "../utils/types";
import { generateRandomBytes } from "../utils/generateTokens";

const userSchema = new mongoose.Schema<IUser, TUserModel, IUserDocument>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      index: true,
      validate: {
        validator: function (email: string) {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          return emailRegex.test(email);
        },
        message: "Invalid Email Format.",
      },
    },
    phone: {
      type: String,
      required: false,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    avatar: {
      type: String,
      required: false,
    },
    role: {
      type: String,
      default: ROLE.USER,
    },
    resetPasswordToken:{
      type: String,
      required: false,
      select: false,
    },
    refreshToken: {
      type: String,
      required: false,
      select: false,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string) {
  return await bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET as string,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generateRefreshToken = async function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    process.env.REFRESH_TOKEN_SECRET as string,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
    },
  );
};

userSchema.methods.generatePasswordResetToken = async function (id: string) {
  const resetPasswordToken = generateRandomBytes(10);
  await User.findOneAndUpdate(
    { _id: id },
    {
      $set: {
        resetPasswordToken: resetPasswordToken,
      },
    },
  );
  return resetPasswordToken;
};
userSchema.methods.updatePassword = async function(password: string) {
  this.password = password
  this.resetPasswordToken = undefined
  await this.save()
}
export const User = mongoose.model<IUser, TUserModel>("User", userSchema);
