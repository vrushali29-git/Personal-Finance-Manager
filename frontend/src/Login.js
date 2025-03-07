import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";
import financeImg from "./images/finance.svg";
import SignImg from "./images/signup.svg";
import User from "./images/person-fill.svg";
import Pass from "./images/lock-fill.svg";
import Mail from "./images/envelope-fill.svg";

export default function Login() {
  const [isSignUpMode, setIsSignUpMode] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const toggleMode = () => {
    setIsSignUpMode(!isSignUpMode);
  };

  // 🚀 Handle User Signup
  const handleSignup = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }), // ✅ FIXED KEYS
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Signup failed");
        return;
      }

      alert("Signup successful! You can now log in.");
      setIsSignUpMode(false); // Switch to Sign In mode
    } catch (error) {
      console.error("Signup error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  // 🚀 Handle User Login
  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }), // ✅ FIXED KEYS
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Login failed");
        return;
      }
      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.username); // Store username

      navigate("/Dashboard");
    } catch (error) {
      console.error("Login error:", error);
      alert("Something went wrong. Try again.");
    }
  };

  return (
    <div className={`container ${isSignUpMode ? "sign-up-mode" : ""}`}>
      <div className="forms-container">
        <div className="signin-signup">
          {/* Sign In Form */}
          <form className="sign-in-form" onSubmit={handleLogin}>
            <h2 className="title">Sign In</h2>
            <div className="input-field">
              <img src={Mail} alt="Email Icon"/>
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="input-field">
              <img src={Pass} alt="Password Icon"/>
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn">Sign In</button>
          </form>

          {/* Sign Up Form */}
          <form className="sign-up-form" onSubmit={handleSignup}>
            <h2 className="title">Sign Up</h2>
            <div className="input-field">
              <img src={User} alt="User Icon"/>
              <input 
                type="text" 
                placeholder="Username" 
                value={username} 
                onChange={(e) => setUsername(e.target.value)} 
                required 
              />
            </div>
            <div className="input-field">
              <img src={Mail} alt="Mail Icon"/>
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="input-field">
              <img src={Pass} alt="Password Icon"/>
              <input 
                type="password" 
                placeholder="Password" 
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required 
              />
            </div>
            <button type="submit" className="btn">Sign Up</button>
          </form>
        </div>
      </div>

      <div className="panels-container">
        <div className="panel left-panel">
          <div className="content">
            <h3>New here?</h3>
            <p>Join our app and get a great hands-on experience of personal finance management.</p>
            <button className="btn transparent" onClick={toggleMode}>Sign Up</button>
          </div>
          <img src={financeImg} className="image" alt="Finance Illustration" />
        </div>
        <div className="panel right-panel">
          <div className="content">
            <h3>Already a member?</h3>
            <p>Log in to access your dashboard and manage your finances.</p>
            <button className="btn transparent" onClick={toggleMode}>Sign In</button>
          </div>
          <img src={SignImg} className="image" alt="Sign In Illustration" />
        </div>
      </div>
    </div>
  );
}

 

