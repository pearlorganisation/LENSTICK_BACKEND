// routes/product.routes.js

import express from "express";
import { createProduct, deleteProduct, getAllProducts, getProductFilters, getSingleProduct, updateProduct, updateVariantStock } from "./product.controller.js";


const router = express.Router();

router.post("/create", createProduct);

router.get("/all", getAllProducts);

router.get("/filters", getProductFilters);

router.get("/:id", getSingleProduct);

router.put("/update/:id", updateProduct);

router.delete("/delete/:id", deleteProduct);

router.put(
  "/update-stock/:productId/:variantId",
  updateVariantStock
);

export default router;