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
    frameColor,
    frameMaterial,
    frameType,
    productCollection,
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

  const variantMatch = {};

  // ✅ Product-level filters
  if (category) matchStage.category = new mongoose.Types.ObjectId(category);
  if (subCategory) matchStage.subCategory = new mongoose.Types.ObjectId(subCategory);
  if (brand) matchStage.brand = { $in: brand.split(",") };
  if (gender) matchStage.gender = { $in: gender.split(",") };
  if (frameShape) matchStage.frameShape = frameShape;
  if (frameMaterial) matchStage.frameMaterial = frameMaterial;
  if (frameType) matchStage.frameType = frameType;
  if (productCollection) matchStage.productCollection = productCollection;

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
  { $match: matchStage },

  { $unwind: "$variants" },

  {
    $match: variantMatch
  },

  {
    $facet: {
      totalCount: [
  {
    $group: {
      _id: "$_id"
    }
  },
  {
    $count: "count"
  }
],
      // ✅ PRODUCTS
      products: [
        { $sort: sortStage },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            brand: { $first: "$brand" },
            frameShape: { $first: "$frameShape" },
            frameType: { $first: "$frameType" },
            variants: { $push: "$variants" }
          }
        },
        { $skip: skip },
        { $limit: Number(limit) }
      ],

      // ✅ BRAND COUNTS
      brands: [
        {
          $group: {
            _id: "$brand",
            count: { $sum: 1 }
          }
        }
      ],

      // ✅ FRAME COLOR COUNTS
      frameColors: [
        {
          $group: {
            _id: "$variants.frameColor",
            count: { $sum: 1 }
          }
        }
      ],

      // ✅ FRAME SHAPE COUNTS
      frameShapes: [
        {
          $group: {
            _id: "$frameShape",
            count: { $sum: 1 }
          }
        }
      ],

      // ✅ SIZE COUNTS
      sizes: [
        {
          $group: {
            _id: "$variants.size",
            count: { $sum: 1 }
          }
        }
      ],

      // ✅ PRICE RANGE
      priceRange: [
        {
          $group: {
            _id: null,
            min: { $min: "$variants.price" },
            max: { $max: "$variants.price" }
          }
        }
      ]
    }
  }
]);

  const result = data[0];

  const totalProducts = result.totalCount[0]?.count || 0;

return {
  products: result.products,
  filters: {
    brands: result.brands,
    frameColors: result.frameColors,
    frameShapes: result.frameShapes,
    sizes: result.sizes,
    priceRange: result.priceRange,
  },
  currentPage: Number(page),

  // ✅ ADDED PAGINATION
  totalPages: Math.ceil(totalProducts / Number(limit)),
  totalProducts,
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
  const product = await Product.findById(id);

  if (!product) {
    throw new Error("Product not found");
  }

  // Merge incoming data into existing product
  Object.assign(product, data);

  // 🔥 This triggers pre("save") hook
  await product.save();

  return product;
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
