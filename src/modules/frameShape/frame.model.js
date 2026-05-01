import mongoose from "mongoose";

const frameShapeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },

  icon: String, // image (like your screenshot)

  isActive: {
    type: Boolean,
    default: true
  }

}, { timestamps: true });

export default mongoose.model("FrameShape", frameShapeSchema);