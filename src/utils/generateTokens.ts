import { Types } from "mongoose";
import { User } from "../models/user.model";
import { ApiError } from "./ApiError";
import crypto from "crypto";

export const generateAccessAndRefereshTokens = async (
  userId: Types.ObjectId,
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(404, "User not found");
    }
    const accessToken = await user?.generateAccessToken();
    const refreshToken = await user?.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { accessToken, refreshToken };
  } catch (error) {
    throw new ApiError(
      500,
      "Something went wrong while generating referesh and access token",
    );
  }
};

export const generateRandomBytes = (size: number) => {
  return crypto.randomBytes(size).toString("hex");
};
