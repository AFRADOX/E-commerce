import express from "express";
import Product from "./Product.js";

const router = express.Router();

// Public - anyone can see products
router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

export default router;