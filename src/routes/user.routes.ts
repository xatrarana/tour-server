import { Router } from "express";
import {  REGISTER, USERS, deleteAccount, updateAccountDetails, updateRefreshToken } from "../controllers/user.controller";
import { generatePasswordResetToken, isAdmin, isLoggedIn, isLoggedOut, isOwner } from "../middlewares/auth.middleware";
import { schemaValidation } from "../middlewares/schemavalidation.middleware";
import { RegisterValidationSchema, UpdateUserAccountValidationSchema } from "../validation/user.validation";
import { checkActiveSession } from "../middlewares/active-session.middleware";
const router = Router();

router.get("/", isLoggedIn,checkActiveSession, USERS);

router.post("/signup",
isAdmin,
schemaValidation(RegisterValidationSchema), 
REGISTER
);

router.post('/refresh-token',isLoggedOut,updateRefreshToken)
router.patch('/update/:id',isLoggedIn,checkActiveSession,schemaValidation(UpdateUserAccountValidationSchema),isOwner,updateAccountDetails)
router.delete('/delete/:id',isLoggedIn,checkActiveSession,isOwner,deleteAccount)
router.post("/password/new",generatePasswordResetToken,(req,res)=>{
  res.status(200).json({message:"Password reset token sent to your email."})
})



export default router;
