import mongoose from "mongoose";

const serviceableAreaSchema = new mongoose.Schema(
  {
    pincode: {
      type: String,
      required: [true, "Pincode is required"],
      unique: true,
      trim: true,
    },

    city: {
      type: String,
      required: true,
    },

    state: {
      type: String,
      required: true,
    },

    deliveryDays: {
      type: Number,
      default: 3, // default delivery time
    },

    isServiceable: {
      type: Boolean,
      default: true, // true = delivery available
    },

    codAvailable: {
      type: Boolean,
      default: true, // Cash on delivery available or not
    },

    deliveryCharge: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mongoose.model("ServiceableArea", serviceableAreaSchema);
