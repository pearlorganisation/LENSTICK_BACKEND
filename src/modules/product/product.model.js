import mongoose from "mongoose";

/* =========================
   VARIANT SCHEMA
========================= */

const variantSchema = new mongoose.Schema(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    frameColor: {
      type: String,
      required: true,
      trim: true,
    },

    size: {
      type: String,
      enum: ["EXTRA SMALL", "SMALL", "MEDIUM", "LARGE", "EXTRA LARGE"],
    },

    ageGroup: {
      type: String,
      trim: true,
    },

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

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    sold: {
      type: Number,
      default: 0,
    },

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

const productSchema = new mongoose.Schema(
  {
   

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

   

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    subCategory: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SubCategory",
    },

    description: {
      type: String,
      trim: true,
    },

    returnPolicy: {
      type: String,
      trim: true,
    },

    questionsAndAnswers: [
      {
        question: {
          type: String,
          trim: true,
        },
        answer: {
          type: String,
          trim: true,
        },
      },
    ],

   

    gender: [
      {
        type: String,
        enum: ["Men", "Women", "Kids"],
      },
    ],

    frameDimensions: {
      lensWidth: {
        type: Number,
        required: false,
      },
      bridgeWidth: {
        type: Number,
        required: false,
      },
      templeLength: {
        type: Number,
        required: false,
      },
      lensHeight: {
        type: Number,
        required: false,
      },
    },

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

    tags: [String],

    features: [String],

   

    variants: [variantSchema],

   

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

    totalStock: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);



productSchema.pre("save", async function () {
  let total = 0;

  if (this.variants && this.variants.length > 0) {
    this.variants.forEach((variant) => {
      total += (variant.stock || 0);
    });
  }

  this.totalStock = total;
  
});



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
