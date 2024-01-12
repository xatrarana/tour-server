import { type Response, type Request, type NextFunction } from "express";
import { ROLE, IUser, TDecodedToken } from "../utils/types";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user.model";
import sendEmail from "../config/sendEmail";

export const isLoggedIn = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (request.user) {
    next();
  } else {
    response.sendStatus(401);
  }
};

export const isAdmin = (
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  if (request.user && (request.user as IUser).role === ROLE.ADMIN) {
    next();
  } else {
    response.sendStatus(403);
  }
};

export const verifyJWT = asyncHandler(async (req, _, next) => {
  try {
    const token =
      req.cookies.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) throw new ApiError(401, "Unauthorized request");
    const decoded: TDecodedToken | string | JwtPayload = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET!,
    ) as TDecodedToken;
    const user = await User.findById(decoded._id);
    if (!user) {
      throw new ApiError(401, "Invalid Access Token");
    }
    next();
  } catch (error: any) {
    throw new ApiError(401, error?.message || "Invalid access token");
  }
});

export const checkApiKey = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const API_KEY = process.env.API_KEY!;
    const apiKey = req.headers["x-api-key"];
    if (!apiKey) throw new ApiError(401, "Unauthorized request");

    if(API_KEY != apiKey) throw new ApiError(401, "Unauthorized request");
    next();
  }
)

export const generatePasswordResetToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const {body} = req;
    if(!body.email) throw new ApiError(400, "Invalid Fields",[{email: "Email is required"}]);

    try {
      const user = await User.findOne({...body});
      if(!user) throw new ApiError(404, "User not found");
      const token = await user?.generatePasswordResetToken(user._id);
      const localToken = `${token}-${Date.now() + 5 * 60000}`
      const response = await sendEmail(user?.fullName!,user?.email!,localToken)
      next()
    } catch (error) {
      next(error)
    }

  }
)