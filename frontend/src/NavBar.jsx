import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

function NavBar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setUser(storedUser);
  }, [location]);

  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/shop?search=${search}`);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="nav">
      <div className="logo">MyShop</div>
      
      {location.pathname !== "/" && (
        <input
          className="search"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={handleSearch}
        />
      )}

      <div className="links">
        {!user && <Link to="/signup">Signup</Link>}
        {!user && <Link to="/login">Login</Link>}
        
        <Link to="/">Home</Link>
        <Link to="/shop">Shop</Link>
        <Link to="/cart">Cart</Link>
        <Link to="/checkout">Checkout</Link>
        
        {user && <Link to="/orders">My Orders</Link>}

        {/* 🔥 Show "Become a Seller" only for regular users (not vendors) */}
        {user && user.role === "user" && user.vendorStatus === "none" && (
          <Link to="/become-vendor" style={{ color: "#10b981", fontWeight: "bold" }}>
            🏪 Become a Seller
          </Link>
        )}

        {/* Pending Status */}
        {user && user.vendorStatus === "pending" && (
          <span style={{ color: "#f59e0b" }}>⏳ Vendor Pending</span>
        )}

        {/* Vendor Panel */}
        {user && user.role === "vendor" && (
          <Link to="/vendor">Vendor Panel</Link>
        )}

        {/* Admin Panel */}
        {user && user.role === "admin" && (
          <Link to="/admin">Admin Panel</Link>
        )}

        {user && (
          <button className="logout-btn" onClick={logout}>
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default NavBar;
