import express from "express";
import Order from "./Order.js";
import { authMiddleware, adminMiddleware } from "./middleware.js";


const router = express.Router();

router.post("/", async (req, res) => {
  const { name, email, address, cart, total } = req.body;

  const order = await Order.create({
    name,
    email,
    address,
    items: cart,
    total
  });

  res.json({ message: "Order saved", orderId: order._id });
});
router.get("/:email", async (req, res) => {
  const orders = await Order.find({ email: req.params.email });
  res.json(orders);
});
router.put("/:id/status", authMiddleware, adminMiddleware, async (req, res) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true }
  );

  res.json(order);
});

export default router;