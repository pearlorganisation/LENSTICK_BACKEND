// modules/brand/brand.routes.js
import express from "express";
import * as brandController from "./brand.controller.js";

const router = express.Router();

router.post("/", brandController.createBrand); // admin adds brand
router.get("/", brandController.getBrands);    // fetch for dropdown

export default router;