import { Router} from "express";
import { isAdmin, isLoggedIn, isLoggedOut } from "../middlewares/auth.middleware";
import { logout, signin, whoami } from "../controllers/auth.controller";
import passport from "passport";
import { LoginValidationSchema} from "../validation/user.validation";
import { schemaValidation } from "../middlewares/schemavalidation.middleware";
import { checkActiveSession } from "../middlewares/active-session.middleware";
const router = Router();


router.post(
  "/signin",
  isAdmin,
  isLoggedOut,
  schemaValidation(LoginValidationSchema),
  passport.authenticate('local'),
  signin,
);
router.post("/logout", isLoggedIn,checkActiveSession, logout);

router.get("/me", isLoggedIn,checkActiveSession, whoami);

router.get("/admin", isAdmin, (req, res) => {
  res.send(req.user);
});

export default router;
