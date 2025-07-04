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
    linkedin: "",
    portfolio: "",
  });

  const [error, setError] = useState("");
  const [resume, setResume] = useState(null);
  const [logo, setLogo] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [skillsInput, setSkillsInput] = useState('');
  const [skillsList, setSkillsList] = useState([]);

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

  const handleResumeChange = (e) => setResume(e.target.files[0]);
  const handleLogoChange = (e) => setLogo(e.target.files[0]);
  const handleProfilePictureChange = (e) => setProfilePicture(e.target.files[0]);

  const handleAddSkill = () => {
    const skill = skillsInput.trim();
    if (skill && !skillsList.includes(skill)) {
      setSkillsList(prev => [...prev, skill]);
      setSkillsInput('');
    }
  };

  const handleRemoveSkill = (idx) => {
    setSkillsList(prev => prev.filter((_, i) => i !== idx));
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
        const form = new FormData();
        Object.entries(companyData).forEach(([key, value]) => form.append(key, value));
        if (logo) form.append('logo', logo);
        const response = await fetch("http://127.0.0.1:8000/api/companies/create/", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: form,
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
        const form = new FormData();
        Object.entries(jobSeekerData).forEach(([key, value]) => form.append(key, value));
        form.set('skills', JSON.stringify(skillsList));
        if (resume) form.append('resume', resume);
        if (profilePicture) form.append('profile_picture', profilePicture);
        const response = await fetch("http://127.0.0.1:8000/api/auth/update/", {
          method: "PUT",
          headers: {
            "Authorization": `Bearer ${token}`,
          },
          body: form,
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

            <label className="block mb-1 font-medium">Skills</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={skillsInput}
                onChange={e => setSkillsInput(e.target.value)}
                placeholder="Add a skill"
                className="flex-1 p-2 border rounded"
              />
              <button type="button" onClick={handleAddSkill} className="bg-green-500 text-white px-3 py-1 rounded">+</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-4">
              {skillsList.map((skill, idx) => (
                <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                  {skill}
                  <button type="button" onClick={() => handleRemoveSkill(idx)} className="ml-2 text-red-500">&times;</button>
                </span>
              ))}
            </div>

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

            <label className="block mb-2 font-medium">Upload Resume (PDF, DOC, etc.)</label>
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleResumeChange}
              className="w-full mb-4"
            />

            <label className="block mb-2 font-medium">Upload Profile Picture (PNG, JPG, etc.)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePictureChange}
              className="w-full mb-4"
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

            <input
              type="url"
              name="linkedin"
              placeholder="LinkedIn URL"
              value={companyData.linkedin}
              onChange={handleCompanyInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />

            <input
              type="url"
              name="portfolio"
              placeholder="Portfolio URL"
              value={companyData.portfolio}
              onChange={handleCompanyInputChange}
              className="w-full p-3 mb-4 border-2 border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
            />

            <label className="block mb-2 font-medium">Upload Company Logo (PNG, JPG, etc.)</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="w-full mb-4"
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