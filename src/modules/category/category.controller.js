// category.controller.js

import { success } from "zod";
import CustomError from "../../common/utils/customError.js";
import successResponse from "../../common/utils/sucessResponse.js";
import { createCategoryService, deleteCategoryService, getAllCategoriesService, getCategoryByIdService, updateCategoryService } from "./category.service.js";
import { createCategoryValidation } from "./category.validation.js";



class CategoryController {
  static createCategory = async (req,res) =>{
    try {
      const { error } = createCategoryValidation.validate(req.body);

      if(error) {
        throw new CustomError(res, error.details[0].message, 400);
      }

 const image = req.file
      ? {
          url: req.file.location,
          key: req.file.key,
        }
      : null;

    const payload = {
      ...req.body,
      image,
    };


      const result = await createCategoryService(payload);

    return successResponse(res, result, "Category created successfully", 201);

  } catch (error) {

   throw new CustomError(res,error);

  }
}


static getAllCategories = async (req, res) => {
   
  try {
    const result = await getAllCategoriesService();
    return successResponse(res, result, "categories fetched successfully");
  } catch (error) {
    throw new CustomError(res, error);
  }
}

static getCategoryById = async (req, res) => {
  try {
    const result = await getCategoryByIdService(req.params.id);
    return successResponse(res, result , "category fetched successfully");
  } catch (error) {
    throw new CustomError(res, error);
  }

}

static updateCategory = async (req, res) => {
  try {
    // Check validation (optional: you might want a separate updateValidation)
    const { error } = createCategoryValidation.validate(req.body);
    if (error) throw new CustomError(res, error.details[0].message, 400);

    const image = req.file
      ? {
          url: req.file.location,
          key: req.file.key,
        }
      : undefined; 

    const payload = { ...req.body };
    if (image) payload.image = image;

    const result = await updateCategoryService(req.params.id, payload);
    return successResponse(res, result, "Category updated successfully");
  } catch (error) {
    throw new CustomError(res, error);
  }
};

static deleteCategory = async (req, res) => {
  try {
    const result = await deleteCategoryService(req.params.id);
    return successResponse(res, result, "Category deleted successfully");
  } catch (error) {
    throw new CustomError(res, error);
  }
};
}





export default CategoryController;


