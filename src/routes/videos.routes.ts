import { Router} from "express";
import { checkApiKey } from "../middlewares/auth.middleware";
import { VideoBodyUrlCreate} from "../validation/user.validation";
import { schemaValidation } from "../middlewares/schemavalidation.middleware";
import { getVideosUrlList, uploadVideoLink } from "../controllers/video.controller";


const router = Router();
router.get('/',checkApiKey,getVideosUrlList)
router.post('/upload/link', schemaValidation(VideoBodyUrlCreate) ,checkApiKey,uploadVideoLink)
export default router;
