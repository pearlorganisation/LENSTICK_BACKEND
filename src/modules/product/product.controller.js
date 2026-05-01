// controllers/product.controller.js

import CustomError from "../../common/utils/customError.js";
import successResponse from "../../common/utils/sucessResponse.js";
import { createProductService, deleteProductService, getAllProductsService, getProductByIdService, getProductFiltersService, updateProductService, updateVariantStockService } from "./product.services.js";



class ProductController {
  static createProduct = async (req, res) => {
    try {
      const product = await createProductService(req.body);
      return successResponse(res, product, "Product created successfully", 201);
    } catch (error) {
      CustomError(res, error);
    }
  }

  static getAllProducts = async (req, res) => {
    try {
      const data = await getAllProductsService(req.query);
      return successResponse(res, data, "Products fetched successfully");
    } catch (error) {
      CustomError(res, error);
    }
  }
  static getProductById = async (req, res) => {
    try {
      const product = await getProductByIdService(req.params.id);
      return successResponse(res, product, "Product fetched successfully");
    } catch (error) {
      CustomError(res, error);
    }
  }

  static updateProduct = async (req,res) => {
    try {
      const updatedProduct = await updateProductService(
        req.params.id,
        req.body
      );
      return successResponse(res, updatedProduct, "Product updated successfully");
    } catch (error) {
      CustomError(res, error);
    }
  }

  static deleteProduct = async (req, res) => {
    try {
      const deletedProduct = await deleteProductService(req.params.id);
      return successResponse(res, deletedProduct, "Product Deleted Successfully");
    } catch (error) {
      CustomError(res, error);
    }
  }

  static updateVariantStock = async (req, res) => {
    try {
      const product = await updateVariantStockService(
        req.params.productId,
        req.params.variantId,
        req.body.stock
      );

      return successResponse(res, product, "Variant stock updated successfully");
    } catch (error) {
      CustomError(res, error);
    }
  }

  static getProductFilters = async (req, res) => {
    try {
      const filters = await getProductFiltersService();

      return successResponse(res, filters, "Product filters fetched successfully");
    } catch (error) {
      CustomError(res, error);
    }
  }
}




export default ProductController;