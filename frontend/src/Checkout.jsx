import { useState } from "react";                     
import { useNavigate } from "react-router-dom";

function Checkout({ cart, setCart }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");                
  const user = JSON.parse(localStorage.getItem("user"));
const [email, setEmail] = useState(user?.email || "");
          
  const [address, setAddress] = useState("");        

  const placeOrder = async() => {                         
    if (!name || !email || !address) {
      alert("Fill all details");
      return;
    }

    if (cart.length === 0) {
      alert("Cart is empty");
      return;
    }
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0)

    await fetch("http://localhost:5000/api/orders", {    
      method: "POST",                                   
      headers: { "Content-Type": "application/json" },  
      body: JSON.stringify({                             
        name,
        email,
        address,
        cart,
        total
      })
    });
   

    setCart([]);
    navigate("/order");
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div style={{ padding: 40, color: "white" }}>
      <h2>Checkout</h2>

      {cart.map((item, index) => (
        <div key={index}>
          {item.name} — {item.qty} × ₹{item.price} = ₹{item.qty * item.price}
        </div>
      ))}

      <h3>Total Payable: ₹{total}</h3>

      <br />
      <input type="text" placeholder="Name" value={name} onChange={e => setName(e.target.value)} />  
      <br />
      <input type="email" placeholder="Email" value={email} readOnly />

      <input type="text" placeholder="Address" value={address} onChange={e => setAddress(e.target.value)} />
      <br />

      <button onClick={placeOrder} style={{backgroundcolor:"green"}}>Place Order</button>
    </div>
  );
}

export default Checkout