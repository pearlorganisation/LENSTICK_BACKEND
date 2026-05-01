// routes/product.routes.js

import express from "express";
import ProductController from "./product.controller.js";

import { upload } from "../../common/middleware/upload.middleware.js";
import S3Service from "../../common/utils/commonService/awsS3.service.js";

const router = express.Router();

router.post("/create", ProductController.createProduct);

router.get("/all", ProductController.getAllProducts);

router.get("/filters", ProductController.getProductFilters);

router.get("/:id", ProductController.getProductById);

router.put("/update/:id", ProductController.updateProduct);

router.delete("/delete/:id", ProductController.deleteProduct);

router.put("/update-stock/:productId/:variantId", ProductController.updateVariantStock);

export default router;

