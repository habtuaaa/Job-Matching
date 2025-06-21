import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      .get("http://127.0.0.1:8000/api/companies/my-profile/", {
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Company Dashboard</h2>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Logout
            </button>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {companyData ? (
            <div className="space-y-6">
              {/* Company Profile Section */}
              <div className="border-b-2 border-gray-200 pb-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {companyData.company_name?.charAt(0) || 'C'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {companyData.company_name}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Email:</span> {companyData.email}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Industry:</span> {companyData.industry}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Location:</span> {companyData.location}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Description:</span> {companyData.description || "Not provided"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Listings Section */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Job Listings</h3>
                {companyData.job_listings && companyData.job_listings.length > 0 ? (
                  <div className="space-y-4">
                    {companyData.job_listings.map((job, index) => (
                      <div key={index} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-semibold text-blue-600 mb-2">{job}</h4>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No job listings available</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                  Edit Profile
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                  Post New Job
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading company data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard; 