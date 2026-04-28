// category.controller.js

import { createCategoryService } from "./category.service.js";
import { createCategoryValidation } from "./category.validation.js";

export const createCategory = async (req, res) => {
  try {

  
    const { error } = createCategoryValidation.validate(req.body);

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.details[0].message,
      });
    }

    // create category
    const result = await createCategoryService(req.body);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }
};



// category.controller.js

import {
  getAllCategoriesService,
  getSingleCategoryService,
} from "./category.service.js";


// GET ALL CATEGORIES
export const getAllCategories = async (req, res) => {

  try {

    const result = await getAllCategoriesService();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data: result,
    });

  } catch (error) {

    return res.status(500).json({
      success: false,
      message: error.message,
    });

  }

};


// GET SINGLE CATEGORY
export const getSingleCategory = async (req, res) => {

  try {

    const result = await getSingleCategoryService(
      req.params.id
    );

    return res.status(200).json({
      success: true,
      message: "Category fetched successfully",
      data: result,
    });

  } catch (error) {

    return res.status(404).json({
      success: false,
      message: error.message,
    });

  }

};