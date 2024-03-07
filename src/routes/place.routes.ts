import { Router } from "express";
import { checkApiKey, isLoggedIn, verifyJWT } from "../middlewares/auth.middleware";
import { PLACES, createPlace, deletePlace, getPlace, rating, updatePlace } from "../controllers/place.controller";
import { upload } from "../middlewares/multer.middleware";
import { checkFileSize } from "../middlewares/filesize.middleware";
import { schemaValidation } from "../middlewares/schemavalidation.middleware";
import { PartialPlaceUpdateValidationSchema, PlaceRatingValidationSchema, PlaceValidationSchema } from "../validation/place.validation";
import { checkActiveSession } from "../middlewares/active-session.middleware";
const router = Router();

// router.get("/", isLoggedIn,checkActiveSession, verifyJWT, PLACES);
router.get("/", checkApiKey, PLACES);

router.get('/:id', isLoggedIn,checkActiveSession, verifyJWT, getPlace)
router.post(
  "/create",
  isLoggedIn,
  upload.fields([
    { name: "thumbnail", maxCount: 1 },
    { name: "images", maxCount: 10 },
  ]),
  schemaValidation(PlaceValidationSchema),
  checkFileSize,
  createPlace,
);

router.patch("/:id/rate", isLoggedIn,checkActiveSession, verifyJWT, schemaValidation(PlaceRatingValidationSchema),  rating);
router.patch("/:id/update", isLoggedIn,checkActiveSession, verifyJWT,schemaValidation(PartialPlaceUpdateValidationSchema), updatePlace);
router.delete('/:id/clear', isLoggedIn,checkActiveSession, verifyJWT, deletePlace)
export default router;
