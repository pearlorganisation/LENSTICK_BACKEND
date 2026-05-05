// services/product.service.js

import Product from "./product.model.js";

/* =========================================
   CREATE PRODUCT
========================================= */

export const createProductService = async (data) => {
  return await Product.create(data);
};

/* =========================================
   GET ALL PRODUCTS
========================================= */

export const getAllProductsService = async (queryParams) => {
  const {
    category,
    subCategory,
    brand,
    gender,
    frameShape,
    frameMaterial,
    frameType,
    collection,
    color,
    size,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 10,
    sort = "latest",
  } = queryParams;

  const query = {
    isActive: true,
  };

  if (category) query.category = category;

  if (subCategory) query.subCategory = subCategory;

  if (brand) query.brand = brand;

  if (gender) query.gender = gender;

  if (frameShape) query.frameShape = frameShape;

  if (frameMaterial) query.frameMaterial = frameMaterial;

  if (frameType) query.frameType = frameType;

  if (collection) query.collection = collection;

  /* =========================================
     VARIANT FILTERS
  ========================================= */

  

  if (size) {
    query["variants.size"] = size;
  }

  /* =========================================
     PRICE FILTER
  ========================================= */

  if (minPrice || maxPrice) {
    query["variants.price"] = {};

    if (minPrice) {
      query["variants.price"].$gte = Number(minPrice);
    }

    if (maxPrice) {
      query["variants.price"].$lte = Number(maxPrice);
    }
  }

  /* =========================================
     SEARCH
  ========================================= */

  if (search) {
    query.$text = {
      $search: search,
    };
  }

  /* =========================================
     SORTING
  ========================================= */

  let sortOption = {};

  switch (sort) {
    case "priceLowToHigh":
      sortOption = {
        "variants.price": 1,
      };
      break;

    case "priceHighToLow":
      sortOption = {
        "variants.price": -1,
      };
      break;

    case "oldest":
      sortOption = {
        createdAt: 1,
      };
      break;

    default:
      sortOption = {
        createdAt: -1,
      };
  }

  const skip = (Number(page) - 1) * Number(limit);

  const products = await Product.find(query)
    .populate("category")
    .populate("subCategory")
    .sort(sortOption)
    .skip(skip)
    .limit(Number(limit));

  const totalProducts = await Product.countDocuments(query);

  return {
    products,
    totalProducts,
    currentPage: Number(page),
    totalPages: Math.ceil(totalProducts / limit),
  };
};

/* =========================================
   GET SINGLE PRODUCT
========================================= */

export const getProductByIdService = async (id) => {
  return await Product.findById(id)
    .populate("category")
    .populate("subCategory");
};

/* =========================================
   UPDATE PRODUCT
========================================= */

export const updateProductService = async (id, data) => {
  return await Product.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

/* =========================================
   DELETE PRODUCT
========================================= */

export const deleteProductService = async (id) => {
  return await Product.findByIdAndDelete(id);
};

/* =========================================
   UPDATE VARIANT STOCK
========================================= */

export const updateVariantStockService = async (
  productId,
  variantId,
  stock
) => {
  const product = await Product.findById(productId);

  if (!product) {
    throw new Error("Product not found");
  }

  const variant = product.variants.id(variantId);

  if (!variant) {
    throw new Error("Variant not found");
  }

  variant.stock = stock;

  await product.save();

  return product;
};

/* =========================================
   GET FILTER COUNTS
========================================= */

export const getProductFiltersService = async () => {
  const colors = await Product.aggregate([
    {
      $unwind: "$variants",
    },
    {
      $group: {
        _id: "$variants.color",
        count: {
          $sum: "$variants.stock",
        },
      },
    },
  ]);

  const frameShapes = await Product.aggregate([
    {
      $group: {
        _id: "$frameShape",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  const brands = await Product.aggregate([
    {
      $group: {
        _id: "$brand",
        count: {
          $sum: 1,
        },
      },
    },
  ]);

  return {
    colors,
    frameShapes,
    brands,
  };
};
