import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function Shop({ cart, setCart }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [products, setProducts] = useState([]);

  const searchQuery = new URLSearchParams(location.search).get("search") || "";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/products");
        const data = await res.json();
        setProducts(data);
      } catch (err) {
        console.log("Error fetching products");
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product) => {
    const exists = cart.find(item => item._id === product._id);

    if (exists) {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, qty: item.qty + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (product) => {
    const exists = cart.find(item => item._id === product._id);

    if (!exists) return;

    if (exists.qty === 1) {
      setCart(cart.filter(item => item._id !== product._id));
    } else {
      setCart(cart.map(item =>
        item._id === product._id
          ? { ...item, qty: item.qty - 1 }
          : item
      ));
    }
  };

  const getQty = (id) => {
    const item = cart.find(i => i._id === id);
    return item ? item.qty : 0;
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="shop">
      <div className="shop-banner">
        <h1>Big Deals</h1>
        <p>Up to 50%</p>
      </div>

      <div className="shop-layout">
        {/* 🛍 Product Grid */}
        <div className="category-grid">
          {filteredProducts.length === 0 && (
            <p style={{ 
              gridColumn: "1 / -1", 
              textAlign: "center", 
              padding: "40px",
              color: "#64748b",
              fontSize: "18px"
            }}>
              No products found
            </p>
          )}

          {filteredProducts.map(product => {
            const qty = getQty(product._id);

            return (
              <div key={product._id} className="category-card">
                <img
                  src={product.image}
                  alt={product.name}
                />

                <h3>{product.name}</h3>
                <p className="price">₹{product.price}</p>

                {qty === 0 ? (
                  <button onClick={() => addToCart(product)}>
                    Add to Cart
                  </button>
                ) : (
                  <div className="qty-controls">
                    <button onClick={() => removeFromCart(product)}>-</button>
                    <span>{qty}</span>
                    <button onClick={() => addToCart(product)}>+</button>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 🛒 Cart Sidebar */}
        <div className="cart-sidebar">
          <h3>Your Cart</h3>

          {cart.length === 0 && <p>No items</p>}

          {cart.map(item => (
            <div key={item._id} className="cart-item">
              {item.name} × {item.qty}
            </div>
          ))}

          {cart.length > 0 && (
            <button
              className="checkout-btn"
              onClick={() => navigate("/cart")}
            >
              Proceed to Checkout
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Shop;