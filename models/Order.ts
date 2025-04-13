import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  mrp: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    default: 1
  },
  unit: {
    type: String,
    default: "item"
  },
  total: {
    type: Number,
    required: true
  },
  img: {
    type: String
  },
  category: {
    type: String
  }
});

const Order = new mongoose.Schema({
  orderId: { 
    type: String, 
    required: true,
    unique: true 
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  items: [orderItemSchema],
  mrpTotal: {
    type: Number,
    required: true
  },
  subtotal: {
    type: Number,
    required: true
  },
  productDiscount: {
    type: Number,
    default: 0
  },
  couponDiscount: {
    type: Number,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  shippingCost: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true
  },
  shippingAddress: {
    type: Object,
    required: true
  },
  status: {
    type: String,
    enum: ["pending", "processing", "shipped", "delivered", "cancelled"],
    default: "pending"
  },
  paymentStatus: {
    type: String,
    enum: ["pending", "completed", "failed", "refunded"],
    default: "pending"
  },
  paymentMethod: {
    type: String,
    required: true,
    default: "COD"
  },
  couponCode: {
    type: String
  },
  expectedDelivery: {
    type: Date
  },
  deliveredAt: {
    type: Date
  },
  orderNotes: {
    type: String
  },
  trackingInfo: {
    type: String
  }
}, { timestamps: true });

export default mongoose.models.Order || mongoose.model("Order", Order);