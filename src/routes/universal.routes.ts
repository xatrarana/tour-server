import  { Router } from "express";

import { changeCurrentPassword } from "../controllers/user.controller";
const router = Router();
router.patch("/password/reset/:token",changeCurrentPassword)

export default router