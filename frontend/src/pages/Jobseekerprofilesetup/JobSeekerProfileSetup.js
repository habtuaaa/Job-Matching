import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./JobSeekerProfileSetup.css";

function JobSeekerProfileSetup() {
  const navigate = useNavigate();
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
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("You must be logged in to update your profile.");
        return;
      }

      const updatedData = {
        ...formData,
        skills: formData.skills ? formData.skills.split(",").map(skill => skill.trim()) : [],
      };

      const response = await axios.put("http://127.0.0.1:8000/api/auth/update", updatedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      // ✅ Save user data to localStorage
      localStorage.setItem("user", JSON.stringify(response.data));
      
      alert("Profile successfully updated!");
      navigate("/jobseeker");  // ✅ Redirect to Dashboard

    } catch (error) {
      setError(error.response?.data?.detail || "Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-setup">
      <h3>Complete Your Job Seeker Profile</h3>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="name" placeholder="Full Name" value={formData.name} onChange={handleChange} required />
        <input type="text" name="skills" placeholder="Skills (comma-separated)" value={formData.skills} onChange={handleChange} required />
        <input type="text" name="profile_picture" placeholder="Profile Picture URL" value={formData.profile_picture} onChange={handleChange} />
        <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleChange} required />
        <input type="text" name="experience" placeholder="Experience" value={formData.experience} onChange={handleChange} required />
        <input type="text" name="education" placeholder="Education" value={formData.education} onChange={handleChange} />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} />
        <input type="text" name="linkedin" placeholder="LinkedIn" value={formData.linkedin} onChange={handleChange} />
        <input type="text" name="portfolio" placeholder="Portfolio URL" value={formData.portfolio} onChange={handleChange} />
        <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Profile"}</button>
      </form>
    </div>
  );
}

export default JobSeekerProfileSetup;
