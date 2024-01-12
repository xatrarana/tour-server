import { Router, type Response, type Request } from "express";
import passport from "passport";
import { REGISTER, USERS } from "../controllers/user.controller";
import { asyncHandler } from "../utils/asyncHandler";
import { ApiError } from "../utils/ApiError";
import { body } from "express-validator";
import { generatePasswordResetToken, isLoggedIn } from "../middlewares/auth.middleware";
const router = Router();

// router.get("/",isLoggedIn, USERS);
router.get("/", isLoggedIn, USERS);
router.post(
  "/signup",
  body("password").isLength({ min: 5 }),
  body("confirmpassword").custom((value, { req }) => {
    return value === req.body.password;
  }),
  REGISTER,
);
router.post("/login", passport.authenticate("local"), (_req, res: Response) => {
  res.sendStatus(200);
});

router.post("/password/new",generatePasswordResetToken,(req,res)=>{
  res.status(200).json({message:"Password reset token sent to your email."})
})


router.get(
  "/error-check",
  asyncHandler(async (_) => {
    throw new ApiError(500, "Something went wrong");
  }),
);
export default router;
