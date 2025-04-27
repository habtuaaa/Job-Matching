import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Home from "./pages/Home";
import Register from "./pages/Register";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import JobSeekerDashboard from "./pages/JobSeekerDashboard/JobSeekerDashboard"; 
import CompanyDashboard from "./pages/CompanyDashboard/CompanyDashboard";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userType, setUserType] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      const storedUserType = localStorage.getItem("userType");

      setIsAuthenticated(!!token);
      setUserType(storedUserType);
    };

    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, []);

  const DashboardRedirect = () => {
    if (!isAuthenticated) return <Navigate to="/login" />;
    if (userType === "job_seeker") return <Navigate to="/dashboard/jobseeker" />;
    if (userType === "company") return <Navigate to="/dashboard/company" />;
    return <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/login" element={<Login />} />
        
        <Route path="/dashboard" element={<DashboardRedirect />} />

        <Route path="/dashboard/jobseeker" element={isAuthenticated ? <JobSeekerDashboard /> : <Navigate to="/login" />} />
        <Route path="/dashboard/company" element={isAuthenticated ? <CompanyDashboard /> : <Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
