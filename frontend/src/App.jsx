import { useState } from "react";
import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";

import NavBar from "./NavBar.jsx";
import Home from "./Home.jsx";
import Shop from "./Shop.jsx";
import Cart from "./Cart.jsx";
import Checkout from "./Checkout.jsx";
import Order from "./Order.jsx";
import Signup from "./Signup.jsx";
import Login from "./Login.jsx";
import OrderHistory from "./OrderHistory.jsx";
import AdminDashboard from "./AdminDashboard.jsx";
import BecomeVendor from "./Vendor.jsx"; 
import VendorDashboard from "./VendorDashboard.jsx"; 
function App() {
  const [cart, setCart] = useState([]);

  // 🔐 ADMIN PROTECTION
  const AdminRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "admin") {
      return <Navigate to="/login" />;
    }
    return children;
  };

  // 🔐 VENDOR PROTECTION
  const VendorRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || user.role !== "vendor") {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop cart={cart} setCart={setCart} />} />
        <Route path="/cart" element={<Cart cart={cart} setCart={setCart} />} />
        <Route path="/checkout" element={<Checkout cart={cart} setCart={setCart} />} />
        <Route path="/order" element={<Order />} />
        <Route path="/orders" element={<OrderHistory />} />
        
        {/* 🔥 NEW ROUTES */}
        <Route path="/become-vendor" element={<BecomeVendor />} />

        <Route
          path="/vendor"
          element={
            <VendorRoute>
              <VendorDashboard />
            </VendorRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

export default App;