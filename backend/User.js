import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: { type: String, default: "user" }, // user, vendor, admin
  vendorStatus: { type: String, default: "none" }, // none, pending, approved, rejected
  shopName: String,
  shopDescription: String,
  requestedAt: Date
}, { timestamps: true });

export default mongoose.model("User", userSchema);