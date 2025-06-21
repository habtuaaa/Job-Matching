import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

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
      const response = await axios.post(
        "http://127.0.0.1:8000/api/auth/signup/",
        {
          email,
          password,
        }
      );

      console.log("Signup response:", response.data);
      console.log("Token:", response.data.access_token);
      console.log("User ID:", response.data.user.id);
      localStorage.setItem("token", response.data.access_token);
      localStorage.setItem("user", JSON.stringify(response.data.user));
      setIsSuccessful(true);
      setTimeout(() => {
        setEmail("");
        setPassword("");
        setConfirmPassword("");
        setIsSuccessful(false);
        navigate("/register");
      }, 2000);
    } catch (err) {
      console.error(
        "Signup error:",
        err.response ? err.response.data : err.message
      );
      setError(
        err.response?.data?.detail || "Registration failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-indigo-50 flex justify-center items-center p-4">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h3 className="text-2xl font-bold text-center mb-6">Sign Up</h3>
        
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          required
        />
        
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            placeholder="Confirm your password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full p-3 pr-12 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
          </button>
        </div>
        
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {isSuccessful && <p className="text-green-500 text-center mb-4 text-lg">Sign-up successful!</p>}
        
        <div className="space-y-3">
          <button 
            type="submit"
            className="w-full p-3 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors duration-300"
          >
            Sign Up
          </button>
        </div>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{" "}
            <Link 
              to="/login" 
              className="text-blue-600 hover:text-blue-800 font-semibold underline"
            >
              Login here
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default SignUp; 