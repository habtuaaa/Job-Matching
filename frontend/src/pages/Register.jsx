import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

const Register = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const initialUserType = searchParams.get("user_type") || "job_seeker";
  const [userType, setUserType] = useState(initialUserType);
  
  const [jobSeekerData, setJobSeekerData] = useState({
    name: "",
    skills: "",
    experience: "",
    education: "",
    location: "",
    phone: "",
    linkedin: "",
    portfolio: "",
  });

  const [companyData, setCompanyData] = useState({
    company_name: "",
    email: "",
    industry: "",
    location: "",
    description: "",
  });

  const [error, setError] = useState("");

  const handleJobSeekerInputChange = (e) => {
    const { name, value } = e.target;
    setJobSeekerData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCompanyInputChange = (e) => {
    const { name, value } = e.target;
    setCompanyData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        return;
      }

      if (userType === "company") {
        // Create company profile
        const response = await fetch("http://127.0.0.1:8000/api/companies/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify(companyData),
        });

        if (response.ok) {
          // Update the user data in localStorage to reflect the company profile
          const userData = JSON.parse(localStorage.getItem("user") || "{}");
          userData.has_company_profile = true;
          localStorage.setItem("user", JSON.stringify(userData));
          
          navigate("/company-dashboard");
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Company profile creation failed");
        }
      } else {
        // Update job seeker profile
        const skillsArray = jobSeekerData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);

        const response = await fetch("http://127.0.0.1:8000/api/auth/update/", {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
          },
          body: JSON.stringify({
            ...jobSeekerData,
            skills: skillsArray,
          }),
        });

        if (response.ok) {
          navigate("/jobseeker-dashboard");
        } else {
          const errorData = await response.json();
          setError(errorData.detail || "Profile update failed");
        }
      }
    } catch (err) {
      console.error("Registration error:", err);
      setError("Registration failed. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h3 className="text-2xl font-bold text-center mb-6">Complete Your Profile</h3>
        
        {/* User Type Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-3">User Type</label>
          <div className="flex justify-center space-x-6">
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="job_seeker"
                checked={userType === "job_seeker"}
                onChange={(e) => setUserType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Job Seeker</span>
            </label>
            <label className="flex items-center cursor-pointer">
              <input
                type="radio"
                name="userType"
                value="company"
                checked={userType === "company"}
                onChange={(e) => setUserType(e.target.value)}
                className="mr-2"
              />
              <span className="text-sm font-medium">Company</span>
            </label>
          </div>
        </div>

        {userType === "job_seeker" ? (
          // Job Seeker Form
          <>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={jobSeekerData.name}
              onChange={handleJobSeekerInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              required
            />

            <input
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              value={jobSeekerData.skills}
              onChange={handleJobSeekerInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />

            <textarea
              name="experience"
              placeholder="Work Experience"
              value={jobSeekerData.experience}
              onChange={handleJobSeekerInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              rows="3"
            />

            <textarea
              name="education"
              placeholder="Education"
              value={jobSeekerData.education}
              onChange={handleJobSeekerInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
              rows="3"
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={jobSeekerData.location}
              onChange={handleJobSeekerInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />

            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              value={jobSeekerData.phone}
              onChange={handleJobSeekerInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />

            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn Profile URL"
              value={jobSeekerData.linkedin}
              onChange={handleJobSeekerInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />

            <input
              type="url"
              name="portfolio"
              placeholder="Portfolio URL"
              value={jobSeekerData.portfolio}
              onChange={handleJobSeekerInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
            />
          </>
        ) : (
          // Company Form
          <>
            <input
              type="text"
              name="company_name"
              placeholder="Company Name"
              value={companyData.company_name}
              onChange={handleCompanyInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />

            <input
              type="email"
              name="email"
              placeholder="Company Email"
              value={companyData.email}
              onChange={handleCompanyInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />

            <input
              type="text"
              name="industry"
              placeholder="Industry"
              value={companyData.industry}
              onChange={handleCompanyInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />

            <input
              type="text"
              name="location"
              placeholder="Location"
              value={companyData.location}
              onChange={handleCompanyInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              required
            />

            <textarea
              name="description"
              placeholder="Company Description"
              value={companyData.description}
              onChange={handleCompanyInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
              rows="4"
              required
            />
          </>
        )}

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <button
          type="submit"
          className={`w-full p-3 font-bold rounded-lg transition-colors duration-300 ${
            userType === "company" 
              ? "bg-blue-500 hover:bg-blue-600 text-white"
              : "bg-green-500 hover:bg-green-600 text-white"
          }`}
        >
          {userType === "company" ? "Create Company Profile" : "Complete Profile Setup"}
        </button>
      </form>
    </div>
  );
};

export default Register; 