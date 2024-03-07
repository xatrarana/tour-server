import { MongooseError } from "mongoose";
import { Video } from "../models/video.model";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";


export const getVideosUrlList = asyncHandler(async (req,res,next) => {
    try {
        const videosList = await Video.find()
        res
    .status(200)
    .json(
      new ApiResponse(201, "video lists.", videosList),
    );
    } catch (error) {
        if(error instanceof MongooseError){
            next(new ApiError(400,error.name,[error.message]))
        }
        next(error)
    }
})

export const uploadVideoLink = asyncHandler(async (req,res, next) => {
    try {
        const {title,url} = req.body
        const createdLink = await Video.create({
            title,
            link:url
        })
        const video = await Video.findById(createdLink._id);
        res
    .status(201)
    .json(
      new ApiResponse(201, "video url created.", video),
    );
    } catch (error) {
        if(error instanceof MongooseError){
            next(new ApiError(400,error.name,[error.message]))
        }
        next(error)
    }
})