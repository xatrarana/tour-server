import { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import passport from "passport";
import { ApiError } from "../utils/ApiError";
import { generateAccessAndRefereshTokens } from "../utils/generateTokens";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.model";

export const signup: RequestHandler = asyncHandler(
    async(req: any,res,next) => {
            const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
                req.user._id,
            );
            res
              .status(200)
              .cookie("accessToken", accessToken, { httpOnly: true })
              .cookie("refreshToken", refreshToken, { httpOnly: true })
              .json(
                new ApiResponse(200, "Login successful", 
                  { accessToken,refreshToken },
                ),
              );
          
    }
)

export const logout = 
   asyncHandler(
    async (req: any, res, next) => {
        try {
          const updatedUser = await User.findByIdAndUpdate(
            req.user._id,
            { $unset: { refreshToken: 1 } },
            { new: true },
          );
          console.log(updatedUser);
          if (!updatedUser) {
            throw new ApiError(500,"Failed to update user's refresh token")
          }
          await req.logout((error: any) => {
            if (error) return next(error);
          });
          res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(200, "Logout successful"));
        } catch (error) {
          next(error);
        }
      }

   )

export const whoami: RequestHandler = asyncHandler(
   async (req, res) => {
        if (req.user) {
          res.send(req.user);
        } else {
          res.status(403).json(new ApiError(403, "Unauthorized",[{error: "must be logged in."}]));
        }
      }
)