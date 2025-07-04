import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CompanyProfileSetup = () => {
  const [formData, setFormData] = useState({
    company_name: "",
    email: "",
    industry: "",
    location: "",
    description: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [logo, setLogo] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogoChange = (e) => {
    setLogo(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
        return;
      }

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      if (logo) form.append('logo', logo);

      const response = await axios.post(
        "http://127.0.0.1:8000/api/companies/create/",
        form,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Company profile created:", response.data);
      navigate("/company-dashboard");
    } catch (err) {
      console.error("Company profile creation error:", err);
      setError(
        err.response?.data?.detail || "Failed to create company profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h3 className="text-2xl font-bold text-center mb-6">Company Profile Setup</h3>
        
        <input
          type="text"
          name="company_name"
          placeholder="Company Name"
          value={formData.company_name}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Company Email"
          value={formData.email}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          required
        />

        <input
          type="text"
          name="industry"
          placeholder="Industry"
          value={formData.industry}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          required
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          required
        />

        <textarea
          name="description"
          placeholder="Company Description"
          value={formData.description}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
          rows="4"
          required
        />

        <label className="block mb-2 font-medium">Upload Company Logo (PNG, JPG, etc.)</label>
        <input
          type="file"
          accept="image/*"
          onChange={handleLogoChange}
          className="w-full mb-4"
        />

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 font-bold rounded-lg transition-colors duration-300 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {isLoading ? 'Creating Profile...' : 'Create Company Profile'}
        </button>
      </form>
    </div>
  );
};

export default CompanyProfileSetup; 