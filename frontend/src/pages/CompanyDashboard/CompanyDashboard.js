import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./CompanyDashboard.css";

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/auth/user/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setCompanyData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching company data:", error);
      });
  }, [navigate, token]);

  return (
    <div className="company-dashboard">
      <h2>Company Dashboard</h2>
      {companyData ? (
        <div>
          <p><strong>Company Name:</strong> {companyData.company_name}</p>
          <p><strong>Email:</strong> {companyData.email}</p>
        </div>
      ) : (
        <p>Loading company data...</p>
      )}
    </div>
  );
};

export default CompanyDashboard;
