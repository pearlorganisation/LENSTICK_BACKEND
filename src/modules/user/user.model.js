import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // allows multiple null values
      lowercase: true,
      trim: true,
    },
    phoneNumber: {
      type: String,
      unique: true,
      sparse: true,
    },

    role: {
      type: String,
      enum: ["CUSTOMER", " ADMIN"],
      default: "CUSTOMER",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
    refresh_token: { type: String },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
