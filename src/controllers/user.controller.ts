import { type Response, type Request, type NextFunction } from "express";
import { User } from "../models/user.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { IUser } from "../utils/types";
import jwt from "jsonwebtoken";
import { generateAccessAndRefereshTokens } from "../utils/generateTokens";
import UserProfile from "../models/profile.model";

export const USERS = asyncHandler(async (_, res: Response) => {
  try {
    const users = await User.find();
    const profileUsers = await UserProfile.find()
    const data = [...users,...profileUsers]
    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          "Users successfully fetched.",
          data ?? null,
        ),
      );
  } catch (error: any) {
    throw new ApiError(500, error?.message || "Error fetching users.");
  }
});

export const REGISTER = asyncHandler(async (req: Request, res: Response,next) => {
  const {
    body: { username, fullname, email, password, role },
  } = req;

  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  try {
    if (user) {
      throw new ApiError(403, "user with credentials already exists.")
    }
    const newUser = await User.create({
      username,
      fullname,
      email,
      password,
      role
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
  } catch (error) {
    next(error)
  }
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


export const updateAccountDetails = asyncHandler(
  async(req:any,res:Response,next:NextFunction)=>{
    const {id} = req.params;
    const {body} = req
    try {

     const user =  await User.findOne({
        username: body.username
      })

      if(user){
        throw new ApiError(400,"username already taken.",[{param:"username"}])
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
      {
        $set: {...body}
      },{new:true})

      if(updatedUser === null){
        throw new ApiError(500,"Error updating user.")
      }
      req.user = updatedUser
      res.status(200).json(new ApiResponse(200,"User successfully updated.",updatedUser))
    } catch (error) {
      next(error)
    }
  }
);

export const deleteAccount = asyncHandler(
  async (req: any, res: Response, next: NextFunction) => {
    const { id } = req.params;
    try {
      const deletedUser = await User.findByIdAndDelete(id);
      if (deletedUser === null) {
        throw new ApiError(500, "Error deleting user.");
      }
      res
        .status(200)
        .json(
          new ApiResponse<IUser>(
            200,
            "User successfully deleted.",
            deletedUser,
          ),
        );
    } catch (error) {
      next(error);
    }
  }
)



export const updateRefreshToken = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const incommingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;
    if (!incommingRefreshToken) throw new ApiError(401, "unauthorized request");

    try {
      const payload = jwt.verify(
        incommingRefreshToken,
        process.env.REFRESH_TOKEN_SECRET!,
      ) as { _id: string };
      
      const user = await User.findById(payload._id);
      if (!user) throw new ApiError(401, "invalid refresh token");
      const {accessToken,refreshToken} = await generateAccessAndRefereshTokens(user?._id)
      const options = {
        httpOnly: true,
        secure: true
    }
      
    res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(
            new ApiResponse(
                200, 
                "Access token refresheda",
                {accessToken, refreshToken: refreshToken},
            )
        )
    } catch (error) {
      next(error);
    }
  }
);