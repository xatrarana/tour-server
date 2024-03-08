import mongoose, { MongooseError } from "mongoose";
import { Place } from "../models/place.model";
import { ApiError } from "../utils/ApiError";
import { ApiResponse } from "../utils/ApiResponse";
import { asyncHandler } from "../utils/asyncHandler";
import { uploadOnCloudinary } from "../utils/cloudinary";
import { generateSlugName } from "../utils/constants";
import delteLocalImages from "../utils/deleteLocalImages";

const getLocalPathArray = (files: []) => {
  let localPathArray: string[] = [];
  files.map((file: Express.Multer.File) => {
    localPathArray.push(file.path);
  });
  return localPathArray;
};
export const PLACES = asyncHandler(async (req, res) => {
  try {
    let query = Place.find();

    const { page, limit } = req.query;
    const { category } = req.query;

    if (page && limit) {
      const parsedPage = parseInt(page as string, 10);
      const parsedLimit = parseInt(limit as string, 10);

      query = query
        .skip((parsedPage - 1) * parsedLimit)
        .limit(parsedLimit)
        .select("-__v");
    }

    if (category) {
      query = query.where({ category: category as string });
    }

    const places = await query.exec();

    res
      .status(200)
      .json(new ApiResponse(200, "Places fetched successfully", places));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export const createPlace = asyncHandler(async (req: any, res) => {
  const {
    body: {
      title,
      wardno,
      description,
      location,
      latitude,
      longitude,
      category,
    },
  } = req;



  const slug_name = generateSlugName(title);
  const place = await Place.findOne({ slug_name });
  if (place) {
    throw new ApiError(409, "place already exists");
  }

  const thumbnailLocalPath = req.files?.thumbnail[0]?.path;
  if (!thumbnailLocalPath) {
    throw new ApiError(400, "Thumbnail is required");
  }
  const imagesLocalPaths = getLocalPathArray(req.files?.images);

  const uploadResult = await uploadOnCloudinary(
    thumbnailLocalPath,
    imagesLocalPaths,
  );
  if (!uploadResult) throw new ApiError(500, "Error uploading image");
  delteLocalImages(imagesLocalPaths);
  const { thumbnailUploadedUrl, imagesUploadedUrlArray } = uploadResult;

  await Place.create({
    title,
    slug_name,
    wardno,
    category,
    description,
    location,
    points: {
      coordinates: [latitude, longitude],
    },
    thumbnail: thumbnailUploadedUrl,
    images: imagesUploadedUrlArray,
  });
  const uploadesPlace = await Place.findOne({ slug_name });
  if (!uploadesPlace) throw new ApiError(500, "Error uploading place");

  res
    .status(201)
    .json(new ApiResponse(200, "Place created successfully", uploadesPlace));
});


export const getPlace = asyncHandler(
  async(req, res,next) => {
    const placeId = req.params.id;
    if (!placeId) {
      return next(new ApiError(400, 'Invalid place ID format'));
    }
    try {
      const place = await Place.findById(placeId);
      if(!place) throw new ApiError(404,"Place not found");
      res.status(200).json(new ApiResponse(200,"Place fetched successfully",place))
    } catch (error) {
      if(error instanceof MongooseError){
        return next(new ApiError(400, 'No valid place found.',[{
          params: "Invalid Operation."
        }]))
      }
      next(error)
    }
  }
)


export const rating = asyncHandler(
  async(req,res,next) => {
      const placeId = req.params.id;
      const user: any = req.user
      const {stars} = req.body;  

      if(stars > 5 || stars < 1) throw new ApiError(400,"Stars must be between 1 and 5");
    try {
      
      const place = await Place.findById(placeId);
      if(!place) throw new ApiError(404,"Place not found");
      const existingRatingIndex = place.rating.findIndex(rate => rate.userId === user?._id);
      if (existingRatingIndex !== -1) {
        place.rating[existingRatingIndex].userRating = stars;
      } else {
        place.rating.push({ userId: user?._id, userRating: stars });
      }
      const totalRating =
      place.rating.reduce((sum, entry) => sum + entry.userRating, 0) /
      place.rating.length;
      place.totalRating = totalRating;
      await place.save();
      res.status(200).json(new ApiResponse(200,"Place rated successfully",place))
    } catch (error) {
      next(error)
    }
  }
)


export const deletePlace = asyncHandler(
  async (req,res,next) => {
    const placeId = req.params.id;
    try {
      const place = await Place.findByIdAndDelete(placeId);
      if(!place) throw new ApiError(404,"Place not found");
      res.status(200).json(new ApiResponse(200,"Place deleted successfully",place))
    } catch (error) {
      next(error)
    }
  }
);

export const updatePlace = asyncHandler(
  async (req,res,next) => {
    const placeId = req.params.id;
    const {body} = req;
    try {
      const place = await Place.findByIdAndUpdate(
        placeId,
        {$set: {...body}},
        {
          new:true
        
        })
      if(!place) throw new ApiError(404,"Place not found");
      res.status(200).json(new ApiResponse(200,"Place updated successfully",place))
    } catch (error) {
      next(error)
    }
  }
)