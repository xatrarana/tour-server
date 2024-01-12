import { Router } from "express";
import { isLoggedIn, verifyJWT } from "../middlewares/auth.middleware";
import { PLACES, createPlace, getPlace, rating, updatePlace } from "../controllers/place.controller";
import { upload } from "../middlewares/multer.middleware";
import { checkFileSize } from "../middlewares/filesize.middleware";
const router = Router();

router.get("/", isLoggedIn, verifyJWT, PLACES);

router.get('/:id', isLoggedIn, verifyJWT, getPlace)
router.post(
  "/create",
  isLoggedIn,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  checkFileSize,
  createPlace,
);

router.patch("/:id/rate", isLoggedIn, verifyJWT, rating);
router.patch("/:id/update", isLoggedIn, verifyJWT, updatePlace);

export default router;
