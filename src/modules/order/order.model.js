import mongoose from "mongoose";

// 🧾 Order Item (snapshot)
const orderItemSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    image: {
      type: String,
      required: true,
    },

    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false }
);

// 👁️ Prescription Schema (FIXED)
const prescriptionSchema = new mongoose.Schema(
  {
    method: {
      type: String,
      enum: ["upload", "manual", "later"],
      required: true,
    },

    // 📁 Upload
    fileUrl: {
      type: String,
      required: function () {
        return this.method === "upload";
      },
    },

    // ✍️ Manual entry
    details: {
      leftEye: {
        sph: String,
        cyl: String,
        axis: String,
      },
      rightEye: {
        sph: String,
        cyl: String,
        axis: String,
      },
    },

    // 📩 Send later
    sendVia: {
      type: String,
      enum: ["email", "whatsapp"],
      required: function () {
        return this.method === "later";
      },
    },
  },
  { _id: false }
);

// 📦 Main Order Schema
const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    items: {
      type: [orderItemSchema],
      validate: {
        validator: (arr) => arr.length > 0,
        message: "Order must have at least one item",
      },
    },

    shippingAddress: {
      fullName: { type: String, required: true },
      phoneNumber: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["cod", "online"],
      default: "cod",
    },

    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed"],
      default: "pending",
      index: true,
    },

    orderStatus: {
      type: String,
      enum: ["processing", "shipped", "delivered", "cancelled"],
      default: "processing",
      index: true,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    isPaid: {
      type: Boolean,
      default: false,
    },

    paidAt: Date,

    // 👓 Prescription
    prescription: {
      type: prescriptionSchema,
      required: false, // only for power glasses
    },
  },
  { timestamps: true }
);

// 🚀 Indexes (important for performance)
orderSchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Order", orderSchema);
