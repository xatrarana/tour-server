import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import delteLocalImages from "./deleteLocalImages";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

type TUploadOnCloudinaryFn = (
  localFilePath: string,
  localImagesPathArray?: string[],
) => Promise<{
  thumbnailUploadedUrl: string;
  imagesUploadedUrlArray: string[];
} | null>;

const uploadOnCloudinary: TUploadOnCloudinaryFn = async (
  localFilePath,
  localImagesPathArray,
) => {
  let thumbnailUploadedUrl: string;

  try {
    if (
      !localFilePath ||
      (localImagesPathArray && localImagesPathArray.length < 0)
    )
      return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
      folder: "thumbnails",
    });

    thumbnailUploadedUrl = response.url;
    let imagesUploadedUrlArray: string[] = [];

    if (localImagesPathArray && localImagesPathArray.length > 0) {
      await Promise.all(
        localImagesPathArray.map(async (imageFilePath) => {
          const response = await cloudinary.uploader.upload(imageFilePath, {
            resource_type: "auto",
            folder: "images",
          });
          imagesUploadedUrlArray.push(response.url);
        }),
      );
    }

    fs.unlinkSync(localFilePath);

    return { thumbnailUploadedUrl, imagesUploadedUrlArray };
  } catch (error) {
    console.error(error);
    fs.unlinkSync(localFilePath);
    delteLocalImages(localImagesPathArray!);
    return null;
  }
};

export { uploadOnCloudinary };
