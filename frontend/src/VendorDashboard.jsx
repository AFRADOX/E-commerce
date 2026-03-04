import { useEffect, useState } from "react";


function VendorDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);

  // Product Form
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [stock, setStock] = useState("");
  const [editingId, setEditingId] = useState(null);

  const token = localStorage.getItem("token");

  // Fetch Vendor Stats
  useEffect(() => {
    fetch("http://localhost:5000/api/vendor/stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  // Fetch Vendor Products
  useEffect(() => {
    if (activeTab === "products") {
      fetch("http://localhost:5000/api/vendor/products", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setProducts(data));
    }
  }, [activeTab]);

  // Fetch Vendor Orders
  useEffect(() => {
    if (activeTab === "orders") {
      fetch("http://localhost:5000/api/vendor/orders", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setOrders(data));
    }
  }, [activeTab]);

  const handleProductSubmit = async (e) => {
    e.preventDefault();

    const productData = {
      name,
      price: Number(price),
      image,
      description,
      stock: Number(stock)
    };

    const url = editingId
      ? `http://localhost:5000/api/vendor/products/${editingId}`
      : "http://localhost:5000/api/vendor/products";

    const method = editingId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(productData)
    });

    alert(editingId ? "Product Updated" : "Product Added");
    resetForm();
    fetchProducts();
  };

  const fetchProducts = () => {
    fetch("http://localhost:5000/api/vendor/products", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setProducts(data));
  };

  const resetForm = () => {
    setName("");
    setPrice("");
    setImage("");
    setDescription("");
    setStock("");
    setEditingId(null);
  };

  const editProduct = (product) => {
    setName(product.name);
    setPrice(product.price);
    setImage(product.image);
    setDescription(product.description || "");
    setStock(product.stock || "");
    setEditingId(product._id);
  };

  const deleteProduct = async (id) => {
    if (!confirm("Delete this product?")) return;

    await fetch(`http://localhost:5000/api/vendor/products/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    alert("Product Deleted");
    fetchProducts();
  };

  return (
    <div className="vendor-container">
      <div className="vendor-sidebar">
        <h2>Vendor Panel</h2>
        <button
          className={activeTab === "dashboard" ? "active" : ""}
          onClick={() => setActiveTab("dashboard")}
        >
          📊 Dashboard
        </button>
        <button
          className={activeTab === "products" ? "active" : ""}
          onClick={() => setActiveTab("products")}
        >
          📦 My Products
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          🛒 My Orders
        </button>
      </div>

      <div className="vendor-content">
        {/* Dashboard */}
        {activeTab === "dashboard" && (
          <div>
            <h1>My Shop Dashboard</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>My Products</h3>
                <p className="stat-number">{stats.products || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Orders Received</h3>
                <p className="stat-number">{stats.orders || 0}</p>
              </div>
              <div className="stat-card highlight">
                <h3>Total Revenue</h3>
                <p className="stat-number">₹{stats.totalSales || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products */}
        {activeTab === "products" && (
          <div>
            <h1>Manage My Products</h1>

            <div className="product-form">
              <h3>{editingId ? "Edit Product" : "Add New Product"}</h3>
              <form onSubmit={handleProductSubmit}>
                <input
                  placeholder="Product Name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <input
                  type="number"
                  placeholder="Price"
                  value={price}
                  onChange={e => setPrice(e.target.value)}
                  required
                />
                <input
                  placeholder="Image URL"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                />
                <textarea
                  placeholder="Description"
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                />
                <input
                  type="number"
                  placeholder="Stock"
                  value={stock}
                  onChange={e => setStock(e.target.value)}
                />

                <div className="form-actions">
                  <button type="submit" className="btn-primary">
                    {editingId ? "Update Product" : "Add Product"}
                  </button>
                  {editingId && (
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="products-list">
              <h3>My Products ({products.length})</h3>
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="product-thumb"
                        />
                      </td>
                      <td>{product.name}</td>
                      <td>₹{product.price}</td>
                      <td>{product.stock || 0}</td>
                      <td>
                        <button
                          className="btn-edit"
                          onClick={() => editProduct(product)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn-delete"
                          onClick={() => deleteProduct(product._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders */}
        {activeTab === "orders" && (
          <div>
            <h1>Orders Containing My Products</h1>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Items</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.name}</td>
                    <td>
                      {order.items
                        .filter(item => item.vendorId === JSON.parse(localStorage.getItem("user")).id)
                        .map(item => item.name)
                        .join(", ")}
                    </td>
                    <td>
                      <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

export default VendorDashboard;