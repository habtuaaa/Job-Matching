import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./SignUp.css";

const SignUp = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    setError("");
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/signup/", {
        email,
        password,
      });
      
      console.log("Response:", response.data);  // Debugging
    
      setIsSuccessful(true);
      setTimeout(() => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsSuccessful(false);
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Error:", err.response ? err.response.data : err.message); // Debugging
      setError(err.response?.data?.detail || "Registration failed. Please try again.");
    }
    
  };

  return (
    <div className="signup-container">
      <form className="signup-form" onSubmit={handleSubmit}>
        <h3>Sign Up</h3>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <div className="password-container">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="show-password-button"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        <div className="password-container">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="show-password-button"
          >
            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        {error && <p className="error-message">{error}</p>}
        {isSuccessful && <p className="success-message">Sign-up successful!</p>}
        <div className="button-container">
          <button type="submit">Sign Up</button>
        </div>
      </form>
    </div>
  );
};

export default SignUp;
