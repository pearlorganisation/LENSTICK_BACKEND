import express from "express";
const router = express.Router();
import authRoutes from "./modules/auth/auth.routes.js"
import categoryRoutes from "./modules/category/category.routes.js"
import productRoutes from "./modules/product/product.routes.js"



router.use("/auth", authRoutes);
router.use("/category", categoryRoutes);
router.use("/product", productRoutes);

export default router;