import type { Response, NextFunction } from "express";
import { ApiError } from "../utils/ApiError";

export const checkFileSize = (req: any, res: Response, next: NextFunction) => {
  if (!req.files) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  const thumbnailSize = req.files?.thumbnail[0].size;
  const images = req.files?.images;

  const maxThumbnailSizeMB = 7;
  const maxImageSizeMB = 5;

  const imageSizeExceedsLimit = images.some((image: any) => {
    const imageSizeInBytes = image.size;
    const imageSizeInKB = imageSizeInBytes / 1024;
    const imageSizeInMB = imageSizeInKB / 1024;
    return imageSizeInMB > maxImageSizeMB;
  });

  if (thumbnailSize > 0 && thumbnailSize <= maxThumbnailSizeMB) {
    return res.status(400).json(
      new ApiError(400, "Image size exceeds the allowed limit", [
        {
          msg: "Thumbnail size exceeds the allowed limit",
          maxThumbnailSizeMB: maxThumbnailSizeMB,
          param: "thumbnail",
        },
      ]),
    );
  }

  if (imageSizeExceedsLimit) {
    return res.status(400).json(
      new ApiError(400, "Image size exceeds the allowed limit", [
        {
          msg: "Image size exceeds the allowed limit",
          maxImageSizeMB: maxImageSizeMB,
          param: "images",
        },
      ]),
    );
  }

  next();
};
