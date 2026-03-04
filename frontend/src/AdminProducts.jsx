import { useState } from "react";

function AdminProducts() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const token = localStorage.getItem("token");

  const addProduct = async () => {
    await fetch("http://localhost:5000/api/admin/products", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ name, price, image })
    });

    alert("Product Added");
  };

  return (
    <div>
      <h2>Add Product</h2>

      <input placeholder="Name" onChange={e => setName(e.target.value)} />
      <input placeholder="Price" onChange={e => setPrice(e.target.value)} />
      <input placeholder="Image URL" onChange={e => setImage(e.target.value)} />

      <button onClick={addProduct}>Add Product</button>
    </div>
  );
}

export default AdminProducts;
