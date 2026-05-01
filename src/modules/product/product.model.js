import mongoose from "mongoose";

/* =========================
   VARIANT SCHEMA
========================= */

const variantSchema = new mongoose.Schema(
  {
    // Unique SKU for inventory management
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    /* =========================
       VARIANT ATTRIBUTES
    ========================= */

    // Example: Matte Black, Blue, Brown
    color: {
      type: String,
      required: true,
      trim: true,
    },

    // Example: Matte_Black_with_Gold
    frameColor: {
      type: String,
      required: true,
      trim: true,
    },

    // Example: Small, Medium, Large
    size: {
      type: String,
      enum: ["EXTRA SMALL", "SMALL", "MEDIUM", "LARGE", "EXTRA LARGE"],
    },

    // Example: 2-5 YEARS
    ageGroup: {
      type: String,
      trim: true,
    },

    /* =========================
       PRICING
    ========================= */

    price: {
      type: Number,
      required: true,
    },

    salePrice: {
      type: Number,
    },

    discountPercentage: {
      type: Number,
      default: 0,
    },

    /* =========================
       STOCK MANAGEMENT
    ========================= */

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    sold: {
      type: Number,
      default: 0,
    },

    /* =========================
       VARIANT IMAGES
    ========================= */

    images: [
      {
        url: String,
        public_id: String,
      },
    ],

    /* =========================
       FLAGS
    ========================= */

    isTryOnAvailable: {
      type: Boolean,
      default: false,
    },

    isBuyOneGetOne: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   MAIN PRODUCT SCHEMA
========================= */

const productSchema = new mongoose.Schema(
  {
    /* =========================
       BASIC INFORMATION
    ========================= */

    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    description: {
      type: String,
    },

    shortDescription: {
      type: String,
    },

    /* =========================
       CATEGORY
    ========================= */

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    /* =========================
       PRODUCT FILTERS
    ========================= */

    gender: [
      {
        type: String,
        enum: ["Men", "Women", "Kids"],
      },
    ],

    productType: {
      type: String,
      trim: true,
    },

    frameShape: {
      type: String,
      trim: true,
    },

    frameType: {
      type: String,
      trim: true,
    },

    frameMaterial: {
      type: String,
      trim: true,
    },

    collection: {
      type: String,
      trim: true,
    },

    brand: {
      type: String,
      trim: true,
    },

    /* =========================
       PRODUCT TAGS
    ========================= */

    tags: [String],

    /* =========================
       FEATURES
    ========================= */

    features: [String],

    /* =========================
       VARIANTS
    ========================= */

    variants: [variantSchema],

    /* =========================
       SEO
    ========================= */

    metaTitle: {
      type: String,
    },

    metaDescription: {
      type: String,
    },

    metaKeywords: [String],

    /* =========================
       RATINGS
    ========================= */

    averageRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    /* =========================
       PRODUCT STATUS
    ========================= */

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isBestSeller: {
      type: Boolean,
      default: false,
    },

    isNewArrival: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    /* =========================
       TOTAL STOCK
       (AUTO CALCULATED)
    ========================= */

    totalStock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

/* =========================
   AUTO CALCULATE TOTAL STOCK
========================= */

productSchema.pre("save", function (next) {
  let total = 0;

  this.variants.forEach((variant) => {
    total += variant.stock;
  });

  this.totalStock = total;

  next();
});

/* =========================
   INDEXING
========================= */

productSchema.index({ name: "text" });

productSchema.index({ category: 1 });

productSchema.index({ brand: 1 });

productSchema.index({ frameShape: 1 });

productSchema.index({ frameMaterial: 1 });

productSchema.index({ gender: 1 });

/* =========================
   EXPORT
========================= */

const Product = mongoose.model("Product", productSchema);

export default Product;
