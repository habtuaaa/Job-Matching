import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const JobSeekerProfileSetup = () => {
  const [formData, setFormData] = useState({
    name: "",
    skills: "",
    experience: "",
    education: "",
    location: "",
    phone: "",
    linkedin: "",
    portfolio: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resume, setResume] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleResumeChange = (e) => {
    setResume(e.target.files[0]);
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

      // Convert skills string to array
      const skillsArray = formData.skills.split(',').map(skill => skill.trim()).filter(skill => skill);

      const form = new FormData();
      Object.entries(formData).forEach(([key, value]) => form.append(key, value));
      skillsArray.forEach(skill => form.append('skills', skill));
      if (resume) form.append('resume', resume);

      const response = await axios.put(
        "http://127.0.0.1:8000/api/auth/update/",
        form,
        {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Profile updated:", response.data);
      navigate("/jobseeker-dashboard");
    } catch (err) {
      console.error("Profile update error:", err);
      setError(
        err.response?.data?.detail || "Failed to update profile. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center p-4">
      <form className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleSubmit}>
        <h3 className="text-2xl font-bold text-center mb-6">Job Seeker Profile Setup</h3>
        
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
          required
        />

        <input
          type="text"
          name="skills"
          placeholder="Skills (comma-separated)"
          value={formData.skills}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
        />

        <textarea
          name="experience"
          placeholder="Work Experience"
          value={formData.experience}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
          rows="3"
        />

        <textarea
          name="education"
          placeholder="Education"
          value={formData.education}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
          rows="3"
        />

        <input
          type="text"
          name="location"
          placeholder="Location"
          value={formData.location}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
        />

        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={formData.phone}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
        />

        <input
          type="url"
          name="linkedin"
          placeholder="LinkedIn Profile URL"
          value={formData.linkedin}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
        />

        <input
          type="url"
          name="portfolio"
          placeholder="Portfolio URL"
          value={formData.portfolio}
          onChange={handleInputChange}
          className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-green-500 focus:outline-none"
        />

        <label className="block mb-2 font-medium">Upload Resume (PDF, DOC, etc.)</label>
        <input
          type="file"
          accept=".pdf,.doc,.docx,.txt"
          onChange={handleResumeChange}
          className="w-full mb-4"
        />

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full p-3 font-bold rounded-lg transition-colors duration-300 ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-green-500 hover:bg-green-600 text-white'
          }`}
        >
          {isLoading ? 'Updating Profile...' : 'Complete Profile Setup'}
        </button>
      </form>
    </div>
  );
};

export default JobSeekerProfileSetup; 