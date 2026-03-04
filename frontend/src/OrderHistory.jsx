import { useEffect, useState } from "react";

function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (!user) return; 
    fetch(`http://localhost:5000/api/orders/${user.email}`)
      .then(res => res.json())
      .then(data => setOrders(data));
  }, []);

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h2>Your Order History</h2>

      {orders.length === 0 && <p>No orders yet.</p>}

      {orders.map(order => (
        <div key={order._id} style={{ border: "1px solid white", padding: 10, margin: 10 }}>
          <p><b>Order ID:</b> {order._id}</p>
          <p><b>Total:</b> ₹{order.total}</p>
          <p><b>Date:</b> {new Date(order.createdAt).toLocaleString()}</p>
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;
