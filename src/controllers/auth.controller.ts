import { RequestHandler } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import passport from "passport";
import { ApiError } from "../utils/ApiError";
import { generateAccessAndRefereshTokens } from "../utils/generateTokens";
import { ApiResponse } from "../utils/ApiResponse";
import { User } from "../models/user.model";
import { ROLE } from "../utils/types";

export const signin: RequestHandler = asyncHandler(
    async(req: any,res,next) => {
            const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
                req.user._id,
            );
            const user = await User.findById(req.user._id)

            if (user?.role === ROLE.ADMIN) {
              res.setHeader('x-api-key', process.env.API_KEY!);
              res.setHeader('Authorization', `Bearer ${accessToken}`);
              res
                  .status(200)
                  .cookie("accessToken", accessToken, { httpOnly: true, path: '/', sameSite: 'none', secure:true })
                  .cookie("refreshToken", refreshToken, { httpOnly: true, path: '/', sameSite: 'none', secure:true })
                  .json(
                      new ApiResponse(200, "Login successful", { accessToken, refreshToken, user })
                  );
          } else {
              res
                  .status(200)
                  .json(
                      new ApiResponse(200, "Login successful", { accessToken, refreshToken, user })
                  );
          }
          
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
          if (!updatedUser) {
            throw new ApiError(500,"Failed to update user's refresh token")
          }
         const response  =  await req.logout((error: any) => {
            if (error) return next(error);
            res.clearCookie("connect.sid")
            res.clearCookie("accessToken")
            res.clearCookie("refreshToken")
            res.status(200).json(new ApiResponse(200, "Logout successful"));
          });
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