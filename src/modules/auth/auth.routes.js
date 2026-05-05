import express from "express";
const router = express.Router();
import AuthController from "./auth.controler.js";
import validateBody from "../../common/middleware/parseJOI/validateBody.js";
import authSchema from "./auth.schema.js"; // fix path if needed
import isAuthenticated from "../../common/middleware/auth/isAuthenticated.js";

router.post(
  "/register",
  validateBody(authSchema.register),
  AuthController.register
);

router.post(
  "/verify-otp",
  validateBody(authSchema.verifyOtp),
  AuthController.verifyOtp
);

router.post("/login", validateBody(authSchema.login), AuthController.login);
router.post("/refresh-token", isAuthenticated, AuthController.refreshToken);
router.post("/logout", AuthController.logout);
router.post("/resend", AuthController.resendOtp);

//Google Auth
router.post("/google", AuthController.googleAuthController);

export default router;
