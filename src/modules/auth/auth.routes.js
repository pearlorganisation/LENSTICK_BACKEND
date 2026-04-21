import express from "express";
const router = express.Router();
import AuthController from "./auth.controler";
import validateBody from "../../common/middleware/parseJOI/validateBody";
import authSchema from "../auth/auth.schema.js";

router.post(
  "/register",
  validateBody(authSchema.register),
  AuthController.register
);

export default router;
