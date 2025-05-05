import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CompanyDashboard.css";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/companies/my-profile", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCompanyData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
        setError(error.response?.data?.detail || "Failed to load company data");
      });
  }, [navigate, token]);

  return (
    <div className="company-dashboard">
      <h2>Company Dashboard</h2>
      {error && <p className="error">{error}</p>}
      {companyData ? (
        <div>
          <p>
            <strong>Company Name:</strong> {companyData.company_name}
          </p>
          <p>
            <strong>Email:</strong> {companyData.email}
          </p>
          <p>
            <strong>Industry:</strong> {companyData.industry}
          </p>
          <p>
            <strong>Location:</strong> {companyData.location}
          </p>
          <p>
            <strong>Description:</strong>{" "}
            {companyData.description || "Not provided"}
          </p>
        </div>
      ) : (
        <p>Loading company data...</p>
      )}
    </div>
  );
};

export default CompanyDashboard;
