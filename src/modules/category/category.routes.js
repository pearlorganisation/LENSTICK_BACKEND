import express from "express";
import CategoryController from "./category.controller.js"
import { upload } from "../../common/middleware/upload.middleware.js";
const router = express.Router();




router.post("/create",  upload.single("image"), CategoryController.createCategory);
router.get("/", CategoryController.getAllCategories);


// GET SINGLE CATEGORY
router.get("/:id", CategoryController.getCategoryById);
router.put("/:id", upload.single("image"), CategoryController.updateCategory);

// DELETE CATEGORY (Add this line)
router.delete("/:id", CategoryController.deleteCategory);



export default router;