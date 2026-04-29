import express from "express";
const router = express.Router();
import authRoutes from "./modules/auth/auth.routes.js";
import productRoutes from "./modules/product/product.routes.js"


router.use("/auth", authRoutes);
router.use("/product",productRoutes)

export default router;
