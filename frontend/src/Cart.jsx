import { useNavigate } from "react-router-dom";

function Cart({ cart, setCart }) {
  const navigate = useNavigate(); 

    const removeItem = (index) => {
    const updated = [...cart];
    updated.splice(index, 1);
    setCart(updated);
  };
     const increase = (index) => {                     
    const updated = [...cart];                      
    updated[index].qty += 1;                        
    setCart(updated);                               
  };     

   const decrease = (index) => {                     
    const updated = [...cart];                      
    if (updated[index].qty === 1) {                 
      updated.splice(index, 1);                     
    } else {
      updated[index].qty -= 1;                      
    }
    setCart(updated);                               
  };                                                 

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <div className="cart-page">
      <h2>Shopping Cart</h2>

      {cart.length === 0 && <p>Your cart is empty</p>}

      {cart.map((item, index) => (
        <div key={index} className="cart-row">
          <img src={item.image}alt={item.name} className="cart-img"/> 
          <div className="cart-info">
            <strong>{item.name}</strong>
            <span>₹{item.price} × {item.qty} = ₹{item.price * item.qty}</span>
          </div>
          <button onClick={()=>decrease(index)}>-</button>
          <span>{item.qty}</span>
          <button onClick={()=>increase(index)}>+</button>
          <button  className="remove-btn" onClick={() => removeItem(index)}>
            Remove
          </button>
        </div>
      ))}

      {cart.length > 0 && (
        <>
          <h3>Total: ₹{total}</h3>
        <button className="checkout-btn" onClick={() => navigate("/checkout")}>
          Proceed to Checkout
        </button>
        </>
      )}
    </div>
  )
}

export default Cart
