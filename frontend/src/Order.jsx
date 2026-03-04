import { Link } from "react-router-dom";

function Order() {
  return (
    <div style={{ padding: 40, textAlign: "center", color: "white" }}>
      <h2>🎉 Order Placed Successfully!</h2>
      <p>Thank you for shopping with us.</p>
      <Link to="/shop">
        <button>Continue Shopping</button>
      </Link>
    </div>
  );
}

export default Order;
