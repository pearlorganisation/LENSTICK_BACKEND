// controllers/product.controller.js

import CustomError from "../../common/utils/customError.js";
import successResponse from "../../common/utils/sucessResponse.js";
import { createProductService, deleteProductService, getAllProductsService, getProductByIdService, getProductFiltersService, updateProductService, updateVariantStockService } from "./product.services.js";



class ProductController {
  static async createProduct(req, res, next) {
     console.log("--- DEBUG START ---");
    console.log("Type of req:", typeof req);
    console.log("Type of res:", typeof res);
    console.log("Type of next:", typeof next); // This should say 'function'
    console.log("Body received:", req.body);
    try {
      const product = await createProductService(req.body);
      return successResponse(res, product, "Product created successfully", 201);
    } catch (error) {
      return next(
  new CustomError(error?.message || "Something went wrong", error?.statusCode || 500)
);
    }
  }

  static async getAllProducts(req, res, next) {
    try {
      const data = await getAllProductsService(req.query);
      return successResponse(res, data, "Products fetched successfully");
    } catch (error) {
      return next(new CustomError(error.message, error.statusCode || 500));
    }
  }

  static async getProductById(req, res, next) {
    try {
      const product = await getProductByIdService(req.params.id);
      return successResponse(res, product, "Product fetched successfully");
    } catch (error) {
      return next(new CustomError(error.message, error.statusCode || 500));
    }
  }

  static async updateProduct(req, res, next) {
    try {
      const updatedProduct = await updateProductService(req.params.id, req.body);
      return successResponse(res, updatedProduct, "Product updated successfully");
    } catch (error) {
      return next(new CustomError(error.message, error.statusCode || 500));
    }
  }

  static async deleteProduct(req, res, next) {
    try {
      const deletedProduct = await deleteProductService(req.params.id);
      return successResponse(res, deletedProduct, "Product Deleted Successfully");
    } catch (error) {
      return next(new CustomError(error.message, error.statusCode || 500));
    }
  }

  static async updateVariantStock(req, res, next) {
    try {
      const product = await updateVariantStockService(
        req.params.productId,
        req.params.variantId,
        req.body.stock
      );
      return successResponse(res, product, "Variant stock updated successfully");
    } catch (error) {
      return next(new CustomError(error.message, error.statusCode || 500));
    }
  }

  static async getProductFilters(req, res, next) {
    try {
      const filters = await getProductFiltersService();
      return successResponse(res, filters, "Product filters fetched successfully");
    } catch (error) {
      return next(new CustomError(error.message, error.statusCode || 500));
    }
  }
}

export default ProductController;



