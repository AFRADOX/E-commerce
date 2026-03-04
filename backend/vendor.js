import express from "express";
import Product from "./Product.js";
import Order from "./Order.js";
import { authMiddleware } from "./middleware.js";

const router = express.Router();

router.use(authMiddleware);

// 🔥 Vendor Middleware
const vendorMiddleware = (req, res, next) => {
  if (req.user.role !== "vendor")
    return res.status(403).json({ message: "Vendor access only" });
  next();
};

router.use(vendorMiddleware);

// 🔹 Vendor Stats
router.get("/stats", async (req, res) => {
  const products = await Product.countDocuments({ vendorId: req.user.id });
  
  const orders = await Order.find({
    "items.vendorId": req.user.id
  });

  const sales = orders.reduce((sum, order) => {
    const vendorItems = order.items.filter(item => item.vendorId === req.user.id);
    const vendorTotal = vendorItems.reduce((s, item) => s + (item.price * item.qty), 0);
    return sum + vendorTotal;
  }, 0);

  res.json({
    products,
    orders: orders.length,
    totalSales: sales
  });
});

// 🔹 Vendor Products (Only their products)
router.get("/products", async (req, res) => {
  const products = await Product.find({ vendorId: req.user.id });
  res.json(products);
});

router.post("/products", async (req, res) => {
  const product = await Product.create({
    ...req.body,
    vendorId: req.user.id,
    vendorName: req.user.shopName || "My Shop"
  });
  
  res.json(product);
});

router.put("/products/:id", async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    vendorId: req.user.id
  });

  if (!product)
    return res.status(403).json({ message: "Not your product" });

  const updated = await Product.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true }
  );

  res.json(updated);
});

router.delete("/products/:id", async (req, res) => {
  const product = await Product.findOne({
    _id: req.params.id,
    vendorId: req.user.id
  });

  if (!product)
    return res.status(403).json({ message: "Not your product" });

  await Product.findByIdAndDelete(req.params.id);
  res.json({ message: "Deleted" });
});

// 🔹 Vendor Orders
router.get("/orders", async (req, res) => {
  const orders = await Order.find({
    "items.vendorId": req.user.id
  });

  res.json(orders);
});

export default router;