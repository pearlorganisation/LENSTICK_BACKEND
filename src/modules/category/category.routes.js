import express from "express";
import CategoryController from "./category.controller.js"
import { upload } from "../../common/middleware/upload.middleware.js";
import isAuthenticated from "../../common/middleware/auth/isAuthenticated.js";
import authorizeRoles from "../../common/middleware/auth/authorizeRoles.js";
const router = express.Router();




router.post("/create", isAuthenticated, authorizeRoles("ADMIN"), upload.single("image"), CategoryController.createCategory);
router.get("/",  CategoryController.getAllCategories);


// GET SINGLE CATEGORY
router.get("/:id",  CategoryController.getCategoryById);
router.put("/:id", isAuthenticated, authorizeRoles("ADMIN"), upload.single("image"), CategoryController.updateCategory);

// DELETE CATEGORY (Add this line)
router.delete("/:id", isAuthenticated, authorizeRoles("ADMIN"), CategoryController.deleteCategory);

export default router;