import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "./User.js";

const router = express.Router();

// 🔹 SIGNUP
router.post("/signup", async (req, res) => {
  try {
    const { name, email, password, role, shopName, shopDescription } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const hash = await bcrypt.hash(password, 10);

    // 🔥 Create user based on role
    const userData = {
      name,
      email,
      password: hash,
      role: role || "user"  // Default to "user" if not specified
    };

    // 🔥 If signing up as vendor, add vendor fields
    if (role === "vendor") {
      userData.vendorStatus = "approved";  // 🔥 Auto-approve (free for now)
      userData.shopName = shopName;
      userData.shopDescription = shopDescription;
    }

    await User.create(userData);

    const message = role === "vendor" 
      ? "Vendor account created successfully! You can start selling now."
      : "Signup successful! Please login.";

    res.status(201).json({ message });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔹 LOGIN
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Wrong password" });

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        role: user.role
      },
      "secretkey",
      { expiresIn: "1d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        name: user.name,
        email: user.email,
        role: user.role,
        vendorStatus: user.vendorStatus,
        shopName: user.shopName
      }
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 REQUEST TO BECOME VENDOR (Keep this for users who signed up as "user" and want to upgrade)
router.post("/request-vendor", async (req, res) => {
  try {
    const { email, shopName, shopDescription } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    if (user.vendorStatus === "approved")
      return res.status(400).json({ message: "Already a vendor" });

    if (user.vendorStatus === "pending")
      return res.status(400).json({ message: "Request already pending" });

    user.vendorStatus = "pending";
    user.shopName = shopName;
    user.shopDescription = shopDescription;
    user.requestedAt = new Date();
    await user.save();

    res.json({ message: "Vendor request submitted. Wait for admin approval." });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// 🔥 CREATE ADMIN (Use Once Then Delete)
router.post("/create-admin", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Admin already exists" });

    const hash = await bcrypt.hash(password, 10);

    const admin = await User.create({
      name,
      email,
      password: hash,
      role: "admin"
    });

    res.json({ message: "Admin created successfully", admin });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

export default router;