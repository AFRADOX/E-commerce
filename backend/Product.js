import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String },
  description: String,
  stock: { type: Number, default: 0 },
  vendorId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  vendorName: String
}, { timestamps: true });

export default mongoose.model("Product", productSchema);