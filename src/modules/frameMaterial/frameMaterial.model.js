import mongoose from "mongoose";

const frameMaterialSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  isPremium: {
    type: Boolean,
    default: false
  },

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("FrameMaterial", frameMaterialSchema);