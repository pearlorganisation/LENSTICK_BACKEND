// category.service.js

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


export const getSingleCategoryService = async (id) => {

  const category = await Category.findById(id)
    .populate("parentCategory");

  if (!category) {
    throw new Error("Category not found");
  }

  return category;
};