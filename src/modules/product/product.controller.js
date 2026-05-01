// controllers/product.controller.js

import { createProductService, deleteProductService, getAllProductsService, getProductFiltersService, getSingleProductService, updateProductService, updateVariantStockService } from "./product.services.js";


/* =========================================
   CREATE PRODUCT
========================================= */

export const createProduct = async (req, res) => {
  try {
    const product = await createProductService(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   GET ALL PRODUCTS
========================================= */

export const getAllProducts = async (req, res) => {
  try {
    const data = await getAllProductsService(req.query);

    return res.status(200).json({
      success: true,
      ...data,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   GET SINGLE PRODUCT
========================================= */

export const getSingleProduct = async (req, res) => {
  try {
    const product = await getSingleProductService(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   UPDATE PRODUCT
========================================= */

export const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await updateProductService(
      req.params.id,
      req.body
    );

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   DELETE PRODUCT
========================================= */

export const deleteProduct = async (req, res) => {
  try {
    await deleteProductService(req.params.id);

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   UPDATE VARIANT STOCK
========================================= */

export const updateVariantStock = async (req, res) => {
  try {
    const product = await updateVariantStockService(
      req.params.productId,
      req.params.variantId,
      req.body.stock
    );

    return res.status(200).json({
      success: true,
      message: "Variant stock updated successfully",
      data: product,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* =========================================
   GET FILTER COUNTS
========================================= */

export const getProductFilters = async (req, res) => {
  try {
    const filters = await getProductFiltersService();

    return res.status(200).json({
      success: true,
      filters,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};