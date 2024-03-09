import { Router} from "express";
import { authenticateRequest } from "../middlewares/auth.middleware";
import { VideoBodyUrlCreate} from "../validation/user.validation";
import { schemaValidation } from "../middlewares/schemavalidation.middleware";
import { getVideosUrlList, uploadVideoLink } from "../controllers/video.controller";


const router = Router();
router.get('/',authenticateRequest,getVideosUrlList)
router.post('/upload/link', schemaValidation(VideoBodyUrlCreate) ,authenticateRequest,uploadVideoLink)
export default router;
