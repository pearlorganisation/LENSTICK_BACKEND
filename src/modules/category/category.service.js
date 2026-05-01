// category.service.js

import S3Service from "../../common/utils/commonService/awsS3.service.js";
import Category from "./category.model.js";

export const createCategoryService = async (payload) => {

  // check existing slug
  const existingCategory = await Category.findOne({
    slug: payload.slug,
  });

  if (existingCategory) {
    throw new Error("Category slug already exists");
  }

  // default level
  let level = 0;

  // if parent category exists
  if (payload.parentCategory) {

    const parentCategory = await Category.findById(
      payload.parentCategory
    );

    if (!parentCategory) {
      throw new Error("Parent category not found");
    }

    // increase level
    level = parentCategory.level + 1;
  }

  // create category
  const category = await Category.create({
    ...payload,
    level,
  });

  return category;
};


// category.service.js




// GET ALL CATEGORIES
export const getAllCategoriesService = async () => {

  const categories = await Category.find()
    .populate("parentCategory")
    .sort({ createdAt: -1 });

  return categories;
};


export const getCategoryByIdService = async (id) => {

  const category = await Category.findById(id)
    .populate("parentCategory");

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};




export const updateCategoryService = async (id, payload) => {
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");

  // If a NEW image is uploaded and an OLD image exists, delete the old one from S3
  if (payload.image && category.image?.key) {
    await S3Service.deleteFile(category.image.key);
  }

  // Update logic for hierarchy level if parent changed
  if (payload.parentCategory && payload.parentCategory !== category.parentCategory?.toString()) {
    const parent = await Category.findById(payload.parentCategory);
    if (parent) {
      payload.level = parent.level + 1;
    }
  }

  // Merge payload into category document
  Object.assign(category, payload);
  return await category.save();
};

export const deleteCategoryService = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw new Error("Category not found");

  // 1. Delete associated image from S3 if it exists
  if (category.image?.key) {
    await S3Service.deleteFile(category.image.key);
  }

  // 2. Delete from Database
  await Category.findByIdAndDelete(id);
  
  return { message: "Category deleted successfully" };
};

// ... other services (getAllCategoriesService, etc.)