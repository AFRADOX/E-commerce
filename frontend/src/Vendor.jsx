import { useState } from "react";
import { useNavigate } from "react-router-dom";


function Vendor() {
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!shopName || !shopDescription) {
      alert("Fill all fields");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/request-vendor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: user.email,
        shopName,
        shopDescription
      })
    });

    const data = await res.json();

    if (res.ok) {
      alert(data.message);
      
      // Update local storage
      const updatedUser = { ...user, vendorStatus: "pending" };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      
      navigate("/");
    } else {
      alert(data.message);
    }
  };

  return (
    <div className="vendor-page">
      <div className="vendor-box">
        <h1>🏪 Become a Seller</h1>
        <p>Start selling your products on our platform</p>

        <form onSubmit={handleSubmit}>
          <input
            placeholder="Shop Name (e.g., Fashion Hub)"
            value={shopName}
            onChange={e => setShopName(e.target.value)}
            required
          />
          
          <textarea
            placeholder="Tell us about your shop and what you sell..."
            value={shopDescription}
            onChange={e => setShopDescription(e.target.value)}
            required
          />

          <button type="submit">Submit Request</button>
        </form>

        <p className="vendor-note">
          ℹ️ Your request will be reviewed by our admin team. You'll be notified once approved.
        </p>
      </div>
    </div>
  );
}

export default Vendor;