// frontend/src/pages/Register.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const [userType, setUserType] = useState("job_seeker");
  const [formData, setFormData] = useState({
    name: "",
    skills: "",
    location: "",
    experience: "",
    profile_picture: "",
    education: "",
    phone: "",
    linkedin: "",
    portfolio: "",
    company_name: "",
    description: "",
    industry: "",
    email: "",
    location: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    localStorage.setItem("userType", e.target.value);
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const token = localStorage.getItem("token");

    if (!token) {
      setError("You must be logged in to register.");
      return;
    }

    try {
      if (userType === "job_seeker") {
        const updatedData = {
          name: formData.name,
          skills: formData.skills
            ? formData.skills.split(",").map((skill) => skill.trim())
            : [],
          location: formData.location,
          experience: formData.experience,
          profile_picture: formData.profile_picture,
          education: formData.education,
          phone: formData.phone,
          linkedin: formData.linkedin,
          portfolio: formData.portfolio,
        };
        const response = await axios.put(
          "http://127.0.0.1:8000/api/auth/update",
          updatedData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate("/dashboard/jobseeker");
      } else {
        const companyData = {
          company_name: formData.company_name,
          description: formData.description,
          industry: formData.industry,
          email: formData.email,
          location: formData.location,
        };
        await axios.post(
          "http://127.0.0.1:8000/api/companies/profile",
          companyData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        navigate("/dashboard/company");
      }
    } catch (err) {
      setError(err.response?.data?.detail || "Registration failed");
      console.error("Registration error:", err);
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleSubmit}>
        <h3>Register</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="job_seeker"
              checked={userType === "job_seeker"}
              onChange={handleUserTypeChange}
            />
            Job Seeker
          </label>
          <label>
            <input
              type="radio"
              value="company"
              checked={userType === "company"}
              onChange={handleUserTypeChange}
            />
            Hiring Company
          </label>
        </div>

        {userType === "job_seeker" ? (
          <div className="profile-setup">
            <h4>Job Seeker Profile</h4>
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="skills"
              placeholder="Skills (comma-separated)"
              value={formData.skills}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="experience"
              placeholder="Experience"
              value={formData.experience}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="profile_picture"
              placeholder="Profile Picture URL"
              value={formData.profile_picture}
              onChange={handleChange}
            />
            <input
              type="text"
              name="education"
              placeholder="Education"
              value={formData.education}
              onChange={handleChange}
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={formData.phone}
              onChange={handleChange}
            />
            <input
              type="text"
              name="linkedin"
              placeholder="LinkedIn"
              value={formData.linkedin}
              onChange={handleChange}
            />
            <input
              type="text"
              name="portfolio"
              placeholder="Portfolio URL"
              value={formData.portfolio}
              onChange={handleChange}
            />
          </div>
        ) : (
          <div className="profile-setup">
            <h4>Company Profile</h4>
            <input
              type="text"
              name="company_name"
              placeholder="Company Name"
              value={formData.company_name}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="industry"
              placeholder="Industry"
              value={formData.industry}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="email"
              placeholder="Company Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="location"
              placeholder="Location"
              value={formData.location}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {error && <p className="error">{error}</p>}
        <button type="submit" className="register-btn">
          Register
        </button>
      </form>
    </div>
  );
}

export default Register;
