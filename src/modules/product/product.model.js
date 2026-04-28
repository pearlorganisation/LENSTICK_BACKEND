import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    frameSize: {
      type: String,
      enum: ["XS", "S", "M", "L", "XL"], // fixed → keep enum
    },

    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color", // dynamic (admin controlled)
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    stock: {
      type: Number,
      default: 0,
    },

    images: [String],
  },
  { _id: true },
);

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    // ✅ admin controlled modules
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },

    productType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ProductType",
    },

    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },

    // ✅ fixed → enum is fine
    gender: [
      {
        type: String,
        enum: ["men", "women", "kids", "unisex"],
      },
    ],

    // can later convert if needed
    attributes: {
      frameShape: { type: ObjectId, ref: "FrameShape" },
      frameType: { type: ObjectId, ref: "FrameType" },
      frameMaterial: { type: ObjectId, ref: "FrameMaterial" },
      ageGroup: String,
    },

    variants: [variantSchema],

    // helpful for sorting/filter
    basePrice: Number,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", productSchema);
