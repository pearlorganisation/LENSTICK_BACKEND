// routes/product.routes.js

import express from "express";
import ProductController from "./product.controller.js";
import isAuthenticated from "../../common/middleware/auth/isAuthenticated.js";
import authorizeRoles from "../../common/middleware/auth/authorizeRoles.js";



const router = express.Router();

router.post("/create", isAuthenticated, authorizeRoles("ADMIN"), (req, res, next) => ProductController.createProduct(req, res, next));
router.get("/all",  (req, res, next) => ProductController.getAllProducts(req, res, next));
router.get("/filters", isAuthenticated, authorizeRoles("ADMIN"), (req, res, next) => ProductController.getProductFilters(req, res, next));
router.get("/:id", (req, res, next) => ProductController.getProductById(req, res, next));
router.put("/update/:id", isAuthenticated, authorizeRoles("ADMIN"), (req, res, next) => ProductController.updateProduct(req, res, next));
router.delete("/delete/:id", isAuthenticated, authorizeRoles("ADMIN"), (req, res, next) => ProductController.deleteProduct(req, res, next));
router.put("/update-stock/:productId/:variantId", isAuthenticated, authorizeRoles("ADMIN"), (req, res, next) => ProductController.updateVariantStock(req, res, next));

export default router;
