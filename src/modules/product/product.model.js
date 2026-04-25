import mongoose from "mongoose";
import slugify from "slugify";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters"],
      maxlength: [120, "Name cannot exceed 120 characters"],
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
    },

    description: {
      type: String,
      maxlength: [1000, "Description too long"],
    },

    price: {
      type: Number,
      required: [true, "Price is required"],
      min: [0, "Price cannot be negative"],
    },

    discountPrice: {
      type: Number,
      min: [0, "Discount price cannot be negative"],
      validate: {
        validator: function (value) {
          return !value || value < this.price;
        },
        message: "Discount price must be less than actual price",
      },
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: [true, "Category is required"],
      index: true,
    },

    brand: {
      type: String,
      enum: ["ghost", "victorx", "aristo", "storm"],
      lowercase: true,
      trim: true,
    },

    images: {
      type: [String],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one product image is required",
      },
    },

    stock: {
      type: Number,
      default: 0,
      min: [0, "Stock cannot be negative"],
    },

    // 👓 Frame Details
    frameType: {
      type: String,
      enum: ["full-rim", "half-rim", "rimless"],
      lowercase: true,
    },

    shape: {
      type: String,
      enum: [
        "round",
        "square",
        "aviator",
        "rectangular",
        "wayfarer",
        "cat-eye",
      ],
      lowercase: true,
    },

    material: {
      type: String,
      enum: ["metal", "plastic", "acetate", "titanium"],
      lowercase: true,
      trim: true,
    },

    colors: {
      type: [String],
      required: [true, "At least one color is required"],
      enum: [
        "black",
        "blue",
        "brown",
        "gold",
        "silver",
        "tortoise",
        "transparent",
        "multicolor",
      ],
    },

    size: {
      type: String,
      enum: ["small", "medium", "large"],
      lowercase: true,
    },

    // 🧿 Lens
    lensType: {
      type: [String],
      enum: ["normal", "blue-light", "power"],
      lowercase: true,
    },

    lensTechnology: {
      type: [String],
      enum: ["polarized", "uv-protection", "blue-light-filter"],
      default: [],
    },

    lensColor: {
      type: String,
      enum: ["black", "blue", "green", "brown", "transparent"],
      lowercase: true,
    },

    // 🏷️ Collection
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    gender: { type: String, enum: ["male", "female", "unisex"] },

    numReviews: {
      type: Number,
      default: 0,
      min: 0,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true }
);

// 🔥 Auto-generate slug
productSchema.pre("save", function (next) {
  if (this.name) {
    this.slug = slugify(this.name, { lower: true });
  }
  next();
});

// 🚀 Indexes for filtering performance
productSchema.index({ price: 1 });
productSchema.index({ colors: 1 });
productSchema.index({ shape: 1 });
productSchema.index({ brand: 1 });

export default mongoose.model("Product", productSchema);
