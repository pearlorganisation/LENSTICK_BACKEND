import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  otp: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    enum: ["REGISTER", "FORGOT_PASSWORD"],
    default: "REGISTER",
  },
  email: {
    type: String,
    trim: true,
  },
  phoneNumber: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// auto delete after 5 minutes
otpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 300 });

export default mongoose.model("OTP", otpSchema);