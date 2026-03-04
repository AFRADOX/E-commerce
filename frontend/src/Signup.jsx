import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("user");
  
  const [shopName, setShopName] = useState("");
  const [shopDescription, setShopDescription] = useState("");
  
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirm) {
      alert("Fill all fields");
      return;
    }

    if (password !== confirm) {
      alert("Passwords do not match");
      return;
    }

    if (role === "vendor" && (!shopName || !shopDescription)) {
      alert("Please fill shop name and description");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          role,
          shopName: role === "vendor" ? shopName : undefined,
          shopDescription: role === "vendor" ? shopDescription : undefined
        })
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      alert(data.message);
      navigate("/login");
    } catch (err) {
      alert("Server error");
    }
  };

  return (
    <div className="login-page">
      <div className="login-box">
        <div className="login-left">
          <h1>Create Account</h1>
          <p>Join us and start shopping or selling</p>
        </div>

        <div className="login-right">
          <h2>Sign Up</h2>
          <p>Create your account</p>

          <form onSubmit={handleSignup}>
            {/* 🔥 Role Selection with CSS Classes */}
            <div className="role-selection">
              <label className="role-selection-label">
                I want to:
              </label>
              <div className="role-options">
                <label className={`role-option ${role === "user" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="user"
                    checked={role === "user"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="role-option-text">
                    👤 Buy Products (Customer)
                  </span>
                </label>
                
                <label className={`role-option ${role === "vendor" ? "selected" : ""}`}>
                  <input
                    type="radio"
                    name="role"
                    value="vendor"
                    checked={role === "vendor"}
                    onChange={(e) => setRole(e.target.value)}
                  />
                  <span className="role-option-text">
                    🏪 Sell Products (Vendor)
                  </span>
                </label>
              </div>
            </div>

            <input 
              placeholder="Full Name" 
              value={name} 
              onChange={e => setName(e.target.value)} 
            />
            
            <input 
              type="email" 
              placeholder="Email" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
            />
            
            <input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            
            <input 
              type="password" 
              placeholder="Confirm Password" 
              value={confirm} 
              onChange={e => setConfirm(e.target.value)} 
            />

            {/* Vendor fields */}
            {role === "vendor" && (
              <div className="vendor-fields">
                <input 
                  placeholder="Shop Name (e.g., Fashion Hub)" 
                  value={shopName} 
                  onChange={e => setShopName(e.target.value)}
                />
                
                <textarea 
                  placeholder="Describe your shop and what you sell..."
                  value={shopDescription} 
                  onChange={e => setShopDescription(e.target.value)}
                />
              </div>
            )}

            <button type="submit">Create Account</button>
          </form>

          <p className="signup-text">
            Already have an account? <span onClick={() => navigate("/login")}>Login</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Signup;