import mongoose from "mongoose";

const User = new mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
    },
    phone: {
      type: String,
    },
    address: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "Address",
      },
    ],
    defaultAddress: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: "Address",
    },
    role: {
      type: String,
      default: "User",
    },
    otp: {
      type: Number,
    },
    otpExp: {
      type: Date,
    },
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", User);
