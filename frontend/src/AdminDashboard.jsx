import { useEffect, useState } from "react";


function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [vendorRequests, setVendorRequests] = useState([]);

  const token = localStorage.getItem("token");

  // Fetch Dashboard Stats
  useEffect(() => {
    fetch("http://localhost:5000/api/admin/stats", {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => res.json())
      .then(data => setStats(data));
  }, []);

  // Fetch Products (READ ONLY)
  useEffect(() => {
    if (activeTab === "products") {
      fetch("http://localhost:5000/api/admin/products", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setProducts(data));
    }
  }, [activeTab]);

  // Fetch Orders
  useEffect(() => {
    if (activeTab === "orders") {
      fetch("http://localhost:5000/api/admin/orders", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setOrders(data));
    }
  }, [activeTab]);

  // Fetch Users
  useEffect(() => {
    if (activeTab === "users") {
      fetch("http://localhost:5000/api/admin/users", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setUsers(data));
    }
  }, [activeTab]);

  // Fetch Vendor Requests
  useEffect(() => {
    if (activeTab === "vendors") {
      fetch("http://localhost:5000/api/admin/vendor-requests", {
        headers: { Authorization: `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => setVendorRequests(data));
    }
  }, [activeTab]);

  const updateOrderStatus = async (id, status) => {
    await fetch(`http://localhost:5000/api/admin/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ status })
    });

    alert("Order Updated");
    setOrders(orders.map(o => (o._id === id ? { ...o, status } : o)));
  };

  const deleteUser = async (id) => {
    if (!confirm("Delete this user?")) return;

    const res = await fetch(`http://localhost:5000/api/admin/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    const data = await res.json();

    if (res.ok) {
      alert("User Deleted");
      setUsers(users.filter(u => u._id !== id));
    } else {
      alert(data.message);
    }
  };

  const handleVendorRequest = async (id, action) => {
    await fetch(`http://localhost:5000/api/admin/vendor-requests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ action })
    });

    alert(`Vendor ${action}d`);
    setVendorRequests(vendorRequests.filter(v => v._id !== id));
  };

  return (
    <div className="admin-container">
      {/* Sidebar */}
      <div className="admin-sidebar">
        <h2>Admin Panel</h2>
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
          📦 All Products
        </button>
        <button
          className={activeTab === "orders" ? "active" : ""}
          onClick={() => setActiveTab("orders")}
        >
          🛒 Orders
        </button>
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => setActiveTab("users")}
        >
          👥 Users
        </button>
        <button
          className={activeTab === "vendors" ? "active" : ""}
          onClick={() => setActiveTab("vendors")}
        >
          🏪 Vendor Requests
        </button>
      </div>

      {/* Main Content */}
      <div className="admin-content">
        {/* Dashboard Tab */}
        {activeTab === "dashboard" && (
          <div>
            <h1>Dashboard Overview</h1>
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Total Users</h3>
                <p className="stat-number">{stats.users || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Products</h3>
                <p className="stat-number">{stats.products || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Vendors</h3>
                <p className="stat-number">{stats.vendors || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Total Orders</h3>
                <p className="stat-number">{stats.orders || 0}</p>
              </div>
              <div className="stat-card highlight">
                <h3>Total Revenue</h3>
                <p className="stat-number">₹{stats.totalSales || 0}</p>
              </div>
              <div className="stat-card">
                <h3>Pending Requests</h3>
                <p className="stat-number">{stats.pendingRequests || 0}</p>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab - READ ONLY */}
        {activeTab === "products" && (
          <div>
            <h1>All Products (View Only)</h1>
            <p style={{ color: "#64748b", marginBottom: "20px" }}>
              ℹ️ Vendors manage their own products. You can only view them here.
            </p>

            <div className="products-list">
              <h3>All Products ({products.length})</h3>
              <table>
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Vendor</th>
                    <th>Added</th>
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
                      <td>{product.vendorName || "Unknown"}</td>
                      <td>{new Date(product.createdAt).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === "orders" && (
          <div>
            <h1>Manage Orders</h1>
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order._id}>
                    <td>{order._id}</td>
                    <td>{order.name}</td>
                    <td>{order.email}</td>
                    <td>₹{order.total}</td>
                    <td>
                      <span className={`status ${order.status.toLowerCase()}`}>
                        {order.status}
                      </span>
                    </td>
                    <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td>
                      <select
                        value={order.status}
                        onChange={e =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                      >
                        <option value="Pending">Pending</option>
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div>
            <h1>Manage Users</h1>
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Vendor Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user._id}>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>
                      <span className={`role ${user.role}`}>{user.role}</span>
                    </td>
                    <td>
                      {user.vendorStatus !== "none" && (
                        <span className={`status ${user.vendorStatus}`}>
                          {user.vendorStatus}
                        </span>
                      )}
                    </td>
                    <td>
                      {user.role !== "admin" && (
                        <button
                          className="btn-delete"
                          onClick={() => deleteUser(user._id)}
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Vendor Requests Tab */}
        {activeTab === "vendors" && (
          <div>
            <h1>Vendor Requests</h1>
            {vendorRequests.length === 0 && <p>No pending requests</p>}

            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Shop Name</th>
                  <th>Description</th>
                  <th>Requested</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {vendorRequests.map(vendor => (
                  <tr key={vendor._id}>
                    <td>{vendor.name}</td>
                    <td>{vendor.email}</td>
                    <td>{vendor.shopName}</td>
                    <td>{vendor.shopDescription}</td>
                    <td>{new Date(vendor.requestedAt).toLocaleDateString()}</td>
                    <td>
                      <button
                        className="btn-edit"
                        onClick={() => handleVendorRequest(vendor._id, "approve")}
                      >
                        ✅ Approve
                      </button>
                      <button
                        className="btn-delete"
                        onClick={() => handleVendorRequest(vendor._id, "reject")}
                      >
                        ❌ Reject
                      </button>
                    </td>
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

export default AdminDashboard;
