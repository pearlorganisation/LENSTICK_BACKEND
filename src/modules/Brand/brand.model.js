// modules/brand/brand.model.js
import mongoose from "mongoose";

const brandSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true // prevents duplicate brands
  },

  slug: String, // optional (for SEO / URLs)

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("Brand", brandSchema);