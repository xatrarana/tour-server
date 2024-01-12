import { type Response, type Request, type NextFunction } from "express";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { IUser } from "../utils/types";

export const USERS = asyncHandler(async (_, res: Response) => {
  try {
    const users = await User.find();
    res
      .status(200)
      .json(
        new ApiResponse<IUser[]>(
          200,
          "Users successfully fetched.",
          users ?? null,
        ),
      );
  } catch (error: any) {
    throw new ApiError(500, error?.message || "Error fetching users.");
  }
});

export const REGISTER = asyncHandler(async (req: Request, res: Response) => {
  const {
    body: { username, fullname, email, password, confirmpassword },
  } = req;
  if (
    [username, fullname, email, password, confirmpassword].some(
      (field) => !field || field?.trim() === "",
    )
  ) {
    res
      .status(400)
      .json(
        new ApiError(400, "All fields are required.", [
          "Username",
          "Fullname",
          "Email",
          "Password",
          "Confirm password",
        ]),
      );
  }

  if (password !== confirmpassword) {
    res
      .status(400)
      .json(
        new ApiError(400, "Passwords do not match.", [
          "Password",
          "Confirm password",
        ]),
      );
  }

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (user) {
    res
      .status(403)
      .json(new ApiError(403, "user with credentials already exists."));
  }

  const newUser = await User.create({
    username,
    fullName: fullname,
    email,
    password,
  });

  const createdUser = await User.findById(newUser._id);
  if (createdUser === null) {
    throw new ApiError(500, "Error creating user.");
  }

  res
    .status(201)
    .json(
      new ApiResponse<IUser>(201, "User successfully created.", createdUser),
    );
});


export const changeCurrentPassword = asyncHandler(async(req:Request,res:Response,next: NextFunction)=>{
  const token = req.params.token.split("-")[0]
  const expresIn = req.params.token.split("-")[1]
  
  const {password} = req.body
  try {
      if(Number(expresIn) < Date.now()) {
           await User.findOneAndUpdate({resetPasswordToken: token},{
              $unset:{
                  resetPasswordToken: 1
              }
           },{new:true})
          return next(new ApiError(400,"Token Invalid",[{error:"Token time period expired or invalid."}]))
      }
      if(!req.body.password || req.body.password.length < 5){
          return next(new ApiError(400,"Password is required",[{param:"password"}]))
      }

      const user = await User.findOne({resetPasswordToken: token}).select("-password")
      user?.updatePassword(password)
      req.logOut((err)=>{
          next(err)
      })
      res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json({message:"Password reset successfully",user})
  } catch (error) {
     next(error) 
  }
})