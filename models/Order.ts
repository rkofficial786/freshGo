import mongoose from "mongoose";

const Order = new mongoose.Schema({
  orderId: { 
    type: String, 
    required: true,
    unique: true 
  },
  totalPrice: {
    type: Number,
    required: true
  },
  shippingAddress: {
    type: Object,
    required: true
  },
  products: [
    {
      product: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'Product'
      },
      quantity: {
        type: Number,
        default: 1,
        required: true
      },
      price: {
        type: Number,
        required: true
      }
    }
  ],
  user: {
    type: mongoose.SchemaTypes.ObjectId,
    ref: 'User',
    required: true
  },
  paymentStatus: {
    type: String,
    enum: ["Pending", "Completed", "Failed", "Refunded"],
    default: "Pending"
  },
  paymentMethod: {
    type: String,
    required: true
  },
  orderStatus: {
    type: String,
    enum: ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"],
    default: "Pending"
  },
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", Order);