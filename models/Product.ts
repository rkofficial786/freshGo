import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

const Product = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    img: {
      type: String,
    },
    price: {
      type: Number,
      required: true,
    },
    stockQuantity: {
      type: Number,
      required: true,
      default: 0,
    },
    description: {
      type: String,
    },
    category: {
      type: String,
      required: true,
      enum: ['Fruits', 'Vegetables', 'Dairy', 'Bakery', 'Meat', 'Seafood', 'Snacks', 'Beverages', 'Frozen', 'Household', 'Other']
    },
    rating: {
      avgRating: {
        type: Number,
        default: 0,
      },
      numReviews: {
        type: Number,
        default: 0,
      },
    },
    reviews: [reviewSchema],
    hide: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Product || mongoose.model("Product", Product);