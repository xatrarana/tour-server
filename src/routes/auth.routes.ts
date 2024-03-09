import { Router} from "express";
import { dashBoardAuthCheck, isAdmin, isLoggedIn, isLoggedOut } from "../middlewares/auth.middleware";
import { logout, signin, whoami } from "../controllers/auth.controller";
import passport from "passport";
import { LoginValidationSchema} from "../validation/user.validation";
import { schemaValidation } from "../middlewares/schemavalidation.middleware";
import { checkActiveSession } from "../middlewares/active-session.middleware";
const router = Router();


router.post(
  "/signin",
  isLoggedOut,
  schemaValidation(LoginValidationSchema),
  passport.authenticate('local'),
  signin, 
);
router.post(
  "/signin/ad",
  isLoggedOut,
  schemaValidation(LoginValidationSchema),
  dashBoardAuthCheck,
  passport.authenticate('local'),
  signin, 
);
router.post("/logout", isLoggedIn,checkActiveSession, logout);
router.get('/session',(req,res) =>{
  res.cookie('state', JSON.stringify({isAuthenticated: req.isAuthenticated(), sessionId: req.sessionID}))
  .cookie('SID', JSON.stringify(req.sessionID))
  .json({isAuthenticated: req.isAuthenticated(), sessionId: req.sessionID, user: req.user})
})
router.get("/me", isLoggedIn,checkActiveSession, whoami);

router.get("/admin", isAdmin, (req, res) => {
  res.send(req.user);
});

// google auth
router.get('/google',passport.authenticate('google', {scope: ['email', 'profile'],successRedirect:'/api/v1/auth/success'}))
router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/api/v1/auth/error', successRedirect: '/api/v1/auth/success' }));

export default router;
