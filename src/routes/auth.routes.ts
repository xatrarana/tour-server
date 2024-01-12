import { Router, type Response } from "express";
import passport from "passport";
import { REGISTER } from "../controllers/user.controller";
import { isAdmin, isLoggedIn } from "../middlewares/auth.middleware";
import { generateAccessAndRefereshTokens } from "../utils/generateTokens";
import { User } from "../models/user.model";
import { ApiResponse } from "../utils/ApiResponse";
const router = Router();

router.post("/signup", REGISTER);
router.post(
  "/signin",
  passport.authenticate("local"),
  async (req: any, res: Response) => {
    const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
      req.user._id,
    );
    res
      .status(200)
      .cookie("accessToken", accessToken, { httpOnly: true })
      .cookie("refreshToken", refreshToken, { httpOnly: true })
      .json(
        new ApiResponse<Record<string, string>[]>(200, "Login successful", [
          { accessToken: accessToken },
          { refreshToken: refreshToken },
        ]),
      );
  },
);

router.post("/logout", isLoggedIn, async (req: any, res, next) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user._id,
      { $unset: { refreshToken: 1 } },
      { new: true },
    );
    if (!updatedUser) {
      throw new Error("Failed to update user's refresh token");
    }

    await req.logout((error: any) => {
      if (error) throw error;
    });
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.status(200).json(new ApiResponse(200, "Logout successful"));
  } catch (error) {
    next(error);
  }
});



router.get("/me", isLoggedIn, (req, res) => {
  if (req.user) {
    res.send(req.user);
  } else {
    res.sendStatus(401);
  }
});

router.get("/admin", isAdmin, (req, res) => {
  res.send(req.user);
});

export default router;
