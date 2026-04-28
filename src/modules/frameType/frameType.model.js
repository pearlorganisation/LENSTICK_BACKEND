import mongoose from "mongoose";

const frameTypeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  icon: String, // optional (if UI needs)

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("FrameType", frameTypeSchema);