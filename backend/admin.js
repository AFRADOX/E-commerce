import express from "express";
import User from "./User.js";
import Product from "./Product.js";
import Order from "./Order.js";
import { authMiddleware, adminMiddleware } from "./middleware.js";

const router = express.Router();

router.use(authMiddleware, adminMiddleware);

// 🔹 Dashboard Stats
router.get("/stats", async (req, res) => {
  const users = await User.countDocuments();
  const products = await Product.countDocuments();
  const orders = await Order.countDocuments();
  const vendors = await User.countDocuments({ role: "vendor" });
  const pendingRequests = await User.countDocuments({ vendorStatus: "pending" });
  const sales = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$total" } } }
  ]);

  res.json({
    users,
    products,
    orders,
    vendors,
    pendingRequests,
    totalSales: sales[0]?.total || 0
  });
});

// 🔥 GET VENDOR REQUESTS
router.get("/vendor-requests", async (req, res) => {
  const requests = await User.find({ vendorStatus: "pending" }).select("-password");
  res.json(requests);
});

// 🔥 APPROVE/REJECT VENDOR
router.put("/vendor-requests/:id", async (req, res) => {
  const { action } = req.body;

  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  if (action === "approve") {
    user.role = "vendor";
    user.vendorStatus = "approved";
  } else {
    user.vendorStatus = "rejected";
  }

  await user.save();
  res.json({ message: `Vendor request ${action}d`, user });
});

// 🔹 VIEW All Products (READ ONLY)
router.get("/products", async (req, res) => {
  const products = await Product.find().populate("vendorId", "name shopName");
  res.json(products);
});

// ❌ REMOVED: Admin can't add/edit/delete vendor products

// 🔹 Manage Users
router.get("/users", async (req, res) => {
  const users = await User.find().select("-password");
  res.json(users);
});

router.delete("/users/:id", async (req, res) => {
  const userId = req.params.id;
  
  const user = await User.findById(userId);
  if (user?.role === "admin") {
    return res.status(403).json({ message: "Cannot delete admin users" });
  }

  await User.findByIdAndDelete(userId);
  res.json({ message: "User removed" });
});

// 🔹 VIEW All Orders
router.get("/orders", async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

// 🔹 Update Order Status
router.put("/orders/:id", async (req, res) => {
  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status: req.body.status },
    { new: true }
  );
  res.json(order);
});

export default router;