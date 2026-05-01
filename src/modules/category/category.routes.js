import express from "express";
import { createCategory, getAllCategories, getSingleCategory } from "./category.controller.js";
const router = express.Router();




router.post("/create", createCategory);
router.get("/", getAllCategories);


// GET SINGLE CATEGORY
router.get("/:id", getSingleCategory);


export default router;