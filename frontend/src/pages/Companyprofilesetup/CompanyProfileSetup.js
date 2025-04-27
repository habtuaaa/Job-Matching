import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./CompanyProfileSetup.css";

function CompanyProfileSetup() {
  const [formData, setFormData] = useState({
    companyName: '',
    description: '',
    industry: '',
    location: '',
    size: '',
    jobPostingGuidelines: '',
  });
  const [logo, setLogo] = useState(null);
  const [coverImage, setCoverImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    // Fetch existing company profile
    const fetchProfile = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8000/api/companies/profile/", {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });

        if (response.data) {
          setFormData({
            companyName: response.data.companyName || '',
            description: response.data.description || '',
            industry: response.data.industry || '',
            location: response.data.location || '',
            size: response.data.size || '',
            jobPostingGuidelines: response.data.jobPostingGuidelines || '',
          });
          setIsEditing(true);
        }
      } catch (error) {
        console.error("Error fetching company profile:", error);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, setter) => {
    setter(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    if (logo) data.append('logo', logo);
    if (coverImage) data.append('coverImage', coverImage);

    try {
      if (isEditing) {
        // Update existing company profile
        await axios.put("http://127.0.0.1:8000/api/companies/profile/update/", data, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        alert("Company profile successfully updated!");
      } else {
        // Create new company profile
        await axios.post("http://127.0.0.1:8000/api/companies/profile/", data, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem("token")}`,
            'Content-Type': 'multipart/form-data',
          },
        });

        alert("Company profile successfully created!");
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>{isEditing ? "Edit Company Profile" : "Create Company Profile"}</h3>
      {error && <p className="error">{error}</p>}
      <input type="text" name="companyName" placeholder="Company Name" value={formData.companyName} onChange={handleChange} required />
      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setLogo)} />
      <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, setCoverImage)} />
      <textarea name="description" placeholder="Company Description" value={formData.description} onChange={handleChange} required />
      <button type="submit" disabled={loading}>{loading ? 'Saving...' : isEditing ? 'Update Profile' : 'Create Profile'}</button>
    </form>
  );
}

export default CompanyProfileSetup;
