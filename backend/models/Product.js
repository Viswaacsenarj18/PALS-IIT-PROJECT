import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
      minlength: [3, "Product name must be at least 3 characters"],
    },
    description: {
      type: String,
      maxlength: [1000, "Description cannot exceed 1000 characters"],
      default: "",
      trim: true,
    },
    pricePerKg: {
      type: Number,
      required: [true, "Price per kg is required"],
      min: [0, "Price cannot be negative"],
    },
    totalQuantity: {
      type: Number,
      required: [true, "Total quantity is required"],
      min: [0, "Quantity cannot be negative"],
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    phone: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
    },
    category: {
      type: String,
      default: "other",
      trim: true,
    },
    stock: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/800x600/4CAF50/FFFFFF?text=No+Image",
    },
    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { 
    timestamps: true 
  }
);

// Indexes
productSchema.index({ category: 1 });
productSchema.index({ seller: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model("Product", productSchema);
export default Product;