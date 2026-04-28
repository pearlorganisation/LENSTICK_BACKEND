import express from "express";
const router = express.Router();
import authRoutes from "./modules/auth/auth.routes.js"
import categoryRoutes from "./modules/category/category.routes.js"

router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);


export default router;