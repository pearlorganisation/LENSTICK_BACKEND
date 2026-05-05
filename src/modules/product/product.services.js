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
    size,
    minPrice,
    maxPrice,
    search,
    page = 1,
    limit = 10,
    sort = "latest",
  } = queryParams;

  const matchStage = {
    isActive: true,
  };

  // ✅ Product-level filters
  if (category) matchStage.category = new mongoose.Types.ObjectId(category);
  if (subCategory) matchStage.subCategory = new mongoose.Types.ObjectId(subCategory);
  if (brand) matchStage.brand = { $in: brand.split(",") };
  if (gender) matchStage.gender = { $in: gender.split(",") };
  if (frameShape) matchStage.frameShape = frameShape;
  if (frameMaterial) matchStage.frameMaterial = frameMaterial;
  if (frameType) matchStage.frameType = frameType;
  if (collection) matchStage.collection = collection;

  if (search) {
    matchStage.$text = { $search: search };
  }

  const skip = (Number(page) - 1) * Number(limit);

  // ✅ Sorting
  let sortStage = {};
  if (sort === "priceLowToHigh") sortStage = { "variants.price": 1 };
  else if (sort === "priceHighToLow") sortStage = { "variants.price": -1 };
  else if (sort === "oldest") sortStage = { createdAt: 1 };
  else sortStage = { createdAt: -1 };

  const data = await Product.aggregate([
    
    // 🔥 Step 1: Product-level filter
    { $match: matchStage },

    // 🔥 Step 2: Unwind variants
    { $unwind: "$variants" },

    // 🔥 Step 3: Variant-level filter
    {
      $match: {
        ...(size && { "variants.size": { $in: size.split(",") } }),

        ...((minPrice || maxPrice) && {
          "variants.price": {
            ...(minPrice && { $gte: Number(minPrice) }),
            ...(maxPrice && { $lte: Number(maxPrice) }),
          },
        }),
      },
    },

    // 🔥 Step 4: Sorting
    { $sort: sortStage },

    // 🔥 Step 5: Group back to product
    {
      $group: {
        _id: "$_id",
        name: { $first: "$name" },
        brand: { $first: "$brand" },
        frameType: { $first: "$frameType" },
        frameShape: { $first: "$frameShape" },
        category: { $first: "$category" },
        subCategory: { $first: "$subCategory" },
        variants: { $push: "$variants" },
        createdAt: { $first: "$createdAt" },
      },
    },

    // 🔥 Step 6: Pagination
    { $skip: skip },
    { $limit: Number(limit) },
  ]);

  return {
    products: data,
    currentPage: Number(page),
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

export const getProductFiltersService = async (queryParams) => {
  const { category } = queryParams;

  return await Product.aggregate([
    {
      $match: {
        category: new mongoose.Types.ObjectId(category),
        isActive: true,
      },
    },

    { $unwind: "$variants" },

    {
      $facet: {
        sizes: [
          {
            $group: {
              _id: "$variants.size",
              count: { $sum: 1 },
            },
          },
        ],

        brands: [
          {
            $group: {
              _id: "$brand",
              count: { $sum: 1 },
            },
          },
        ],

        frameShapes: [
          {
            $group: {
              _id: "$frameShape",
              count: { $sum: 1 },
            },
          },
        ],

        priceRange: [
          {
            $group: {
              _id: null,
              min: { $min: "$variants.price" },
              max: { $max: "$variants.price" },
            },
          },
        ],
      },
    },
  ]);
};
