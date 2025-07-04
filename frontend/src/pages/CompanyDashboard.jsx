import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const [companyData, setCompanyData] = useState(null);
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");
  const [showJobModal, setShowJobModal] = useState(false);
  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    requirements: [],
    location: "",
    salary_min: "",
    salary_max: "",
    salary_type: "Negotiable",
    employment_type: "Full-time",
    experience_level: "Entry",
    application_deadline: "",
    benefits: [],
    is_remote: false,
    other_details: "",
  });
  const [jobError, setJobError] = useState("");
  const [jobs, setJobs] = useState([]);
  const [requirementInput, setRequirementInput] = useState("");
  const [benefitInput, setBenefitInput] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    company_name: '',
    email: '',
    industry: '',
    location: '',
    description: '',
    logo: null,
    linkedin: '',
    portfolio: '',
  });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);

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

  useEffect(() => {
    if (companyData && token) {
      axios
        .get(`http://127.0.0.1:8000/api/jobs/?company_id=${companyData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setJobs(res.data.filter(j => j.company === companyData.id)))
        .catch(() => setJobs([]));
    }
  }, [companyData, token]);

  useEffect(() => {
    if (companyData) {
      setEditForm({
        company_name: companyData.company_name || '',
        email: companyData.email || '',
        industry: companyData.industry || '',
        location: companyData.location || '',
        description: companyData.description || '',
        logo: null,
        linkedin: companyData.linkedin || '',
        portfolio: companyData.portfolio || '',
      });
    }
  }, [companyData]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const handleJobInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setJobForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleAddRequirement = () => {
    if (requirementInput.trim()) {
      setJobForm((prev) => ({
        ...prev,
        requirements: [...(Array.isArray(prev.requirements) ? prev.requirements : []), requirementInput.trim()],
      }));
      setRequirementInput("");
    }
  };

  const handleRemoveRequirement = (idx) => {
    setJobForm((prev) => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== idx),
    }));
  };

  const handleAddBenefit = () => {
    if (benefitInput.trim()) {
      setJobForm((prev) => ({
        ...prev,
        benefits: [...(Array.isArray(prev.benefits) ? prev.benefits : []), benefitInput.trim()],
      }));
      setBenefitInput("");
    }
  };

  const handleRemoveBenefit = (idx) => {
    setJobForm((prev) => ({
      ...prev,
      benefits: prev.benefits.filter((_, i) => i !== idx),
    }));
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    setJobError("");
    try {
      const payload = {
        ...jobForm,
        requirements: Array.isArray(jobForm.requirements) ? jobForm.requirements : [],
        benefits: Array.isArray(jobForm.benefits) ? jobForm.benefits : [],
        salary_min: jobForm.salary_min ? parseInt(jobForm.salary_min) : null,
        salary_max: jobForm.salary_max ? parseInt(jobForm.salary_max) : null,
      };
      await axios.post("http://127.0.0.1:8000/api/jobs/post/", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setShowJobModal(false);
      setJobForm({
        title: "",
        description: "",
        requirements: [],
        location: "",
        salary_min: "",
        salary_max: "",
        salary_type: "Negotiable",
        employment_type: "Full-time",
        experience_level: "Entry",
        application_deadline: "",
        benefits: [],
        is_remote: false,
        other_details: "",
      });
      setRequirementInput("");
      setBenefitInput("");
      // Refresh jobs
      if (companyData) {
        const res = await axios.get(`http://127.0.0.1:8000/api/jobs/?company_id=${companyData.id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setJobs(res.data.filter(j => j.company === companyData.id));
      }
    } catch (err) {
      setJobError(err.response?.data?.detail || "Failed to post job");
    }
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditLogoChange = (e) => {
    setEditForm((prev) => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      const form = new FormData();
      form.append('company_name', editForm.company_name);
      form.append('email', editForm.email);
      form.append('industry', editForm.industry);
      form.append('location', editForm.location);
      form.append('description', editForm.description);
      form.append('linkedin', editForm.linkedin);
      form.append('portfolio', editForm.portfolio);
      if (editForm.logo) form.append('logo', editForm.logo);
      const res = await axios.put('http://127.0.0.1:8000/api/companies/update/', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCompanyData(res.data);
      setShowEditModal(false);
      setEditSuccess(true);
    } catch (err) {
      setEditError(err.response?.data?.detail || 'Failed to update profile');
    }
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
                  {companyData.logo ? (
                    <img
                      src={`http://127.0.0.1:8000${companyData.logo}`}
                      alt="Company Logo"
                      className="w-24 h-24 rounded-full object-cover border-2 border-blue-500"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {companyData.company_name?.charAt(0) || 'C'}
                    </div>
                  )}
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
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">LinkedIn:</span> {companyData.linkedin ? (
                        <a href={companyData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{companyData.linkedin}</a>
                      ) : 'Not provided'}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Portfolio:</span> {companyData.portfolio ? (
                        <a href={companyData.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{companyData.portfolio}</a>
                      ) : 'Not provided'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Job Listings Section */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Job Listings</h3>
                {jobs.length > 0 ? (
                  <div className="space-y-4">
                    {jobs.map((job) => (
                      <div key={job.id} className="bg-gray-50 p-4 rounded-lg border-l-4 border-blue-500">
                        <h4 className="font-semibold text-blue-600 mb-2">{job.title}</h4>
                        <p className="text-gray-700 mb-1">{job.description}</p>
                        <p className="text-gray-500 text-sm">Posted: {new Date(job.posted_at).toLocaleDateString()}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500">No job listings available</p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button
                  className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                  onClick={() => setShowEditModal(true)}
                >
                  Edit Profile
                </button>
                <button
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300"
                  onClick={() => setShowJobModal(true)}
                >
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
      <Dialog
        open={showJobModal}
        onClose={() => setShowJobModal(false)}
        maxWidth="md"
        fullWidth
        scroll="paper"
        PaperProps={{
          style: { borderRadius: 16, padding: 0, minHeight: '80vh' }
        }}
      >
        <DialogTitle className="text-3xl font-bold text-center">Post New Job</DialogTitle>
        <DialogContent dividers style={{ padding: 32 }}>
          <form id="job-post-form" onSubmit={handlePostJob} className="space-y-8 divide-y divide-gray-200">
            {jobError && <p className="text-red-500 mb-2">{jobError}</p>}
            {/* Job Details Section */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Job Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Job Title</label>
                  <input name="title" value={jobForm.title} onChange={handleJobInputChange} placeholder="Job Title" className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Location</label>
                  <input name="location" value={jobForm.location} onChange={handleJobInputChange} placeholder="Location" className="w-full p-2 border rounded" required />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1 font-medium">Description</label>
                  <textarea name="description" value={jobForm.description} onChange={handleJobInputChange} placeholder="Description" className="w-full p-2 border rounded" required />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Remote</label>
                  <input name="is_remote" type="checkbox" checked={jobForm.is_remote} onChange={handleJobInputChange} className="mr-2" />
                </div>
              </div>
            </div>
            {/* Requirements Section */}
            <div className="pt-8 space-y-2">
              <h3 className="text-xl font-semibold mb-2 text-blue-700">Requirements</h3>
              <div className="flex gap-2 mb-2">
                <input type="text" value={requirementInput} onChange={e => setRequirementInput(e.target.value)} placeholder="Add requirement" className="flex-1 p-2 border rounded" />
                <Button variant="contained" color="primary" onClick={handleAddRequirement}>+</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(jobForm.requirements) && jobForm.requirements.map((req, idx) => (
                  <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center">
                    {req}
                    <Button size="small" color="error" onClick={() => handleRemoveRequirement(idx)} style={{ minWidth: 0, marginLeft: 8 }}>&times;</Button>
                  </span>
                ))}
              </div>
            </div>
            {/* Benefits Section */}
            <div className="pt-8 space-y-2">
              <h3 className="text-xl font-semibold mb-2 text-green-700">Benefits</h3>
              <div className="flex gap-2 mb-2">
                <input type="text" value={benefitInput} onChange={e => setBenefitInput(e.target.value)} placeholder="Add benefit" className="flex-1 p-2 border rounded" />
                <Button variant="contained" color="success" onClick={handleAddBenefit}>+</Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(jobForm.benefits) && jobForm.benefits.map((ben, idx) => (
                  <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                    {ben}
                    <Button size="small" color="error" onClick={() => handleRemoveBenefit(idx)} style={{ minWidth: 0, marginLeft: 8 }}>&times;</Button>
                  </span>
                ))}
              </div>
            </div>
            {/* Compensation Section */}
            <div className="pt-8 space-y-4">
              <h3 className="text-xl font-semibold mb-2 text-yellow-700">Compensation</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Salary Min</label>
                  <input name="salary_min" value={jobForm.salary_min} onChange={handleJobInputChange} placeholder="Salary Min" type="number" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Salary Max</label>
                  <input name="salary_max" value={jobForm.salary_max} onChange={handleJobInputChange} placeholder="Salary Max" type="number" className="w-full p-2 border rounded" />
                </div>
                <div>
                  <label className="block mb-1 font-medium">Salary Type</label>
                  <select name="salary_type" value={jobForm.salary_type} onChange={handleJobInputChange} className="w-full p-2 border rounded">
                    <option value="Negotiable">Negotiable</option>
                    <option value="Range">Range</option>
                    <option value="Fixed">Fixed</option>
                  </select>
                </div>
              </div>
            </div>
            {/* Other Details Section */}
            <div className="pt-8 space-y-4">
              <h3 className="text-xl font-semibold mb-2 text-purple-700">Other Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium">Employment Type</label>
                  <select name="employment_type" value={jobForm.employment_type} onChange={handleJobInputChange} className="w-full p-2 border rounded">
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Contract">Contract</option>
                    <option value="Internship">Internship</option>
                    <option value="Temporary">Temporary</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Experience Level</label>
                  <select name="experience_level" value={jobForm.experience_level} onChange={handleJobInputChange} className="w-full p-2 border rounded">
                    <option value="Entry">Entry</option>
                    <option value="Mid">Mid</option>
                    <option value="Senior">Senior</option>
                    <option value="Director">Director</option>
                    <option value="Executive">Executive</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block mb-1 font-medium">Application Deadline</label>
                  <input name="application_deadline" value={jobForm.application_deadline} onChange={handleJobInputChange} placeholder="Application Deadline" type="date" className="w-full p-2 border rounded" />
                </div>
                <div className="col-span-2">
                  <label className="block mb-1 font-medium">Other Details</label>
                  <textarea name="other_details" value={jobForm.other_details} onChange={handleJobInputChange} placeholder="Other Details" className="w-full p-2 border rounded" />
                </div>
              </div>
            </div>
          </form>
        </DialogContent>
        <Divider />
        <DialogActions style={{ padding: 24 }}>
          <Button onClick={() => setShowJobModal(false)} color="secondary" variant="outlined">Cancel</Button>
          <Button type="submit" form="job-post-form" color="success" variant="contained">Post Job</Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        PaperProps={{ style: { borderRadius: 16, padding: 0 } }}
      >
        <DialogTitle className="text-2xl font-bold text-center">Edit Company Profile</DialogTitle>
        <DialogContent dividers style={{ padding: 32 }}>
          <form id="edit-profile-form" onSubmit={handleEditProfile} className="space-y-6">
            {editError && <p className="text-red-500 mb-2">{editError}</p>}
            <div>
              <label className="block mb-1 font-medium">Company Name</label>
              <input name="company_name" value={editForm.company_name} onChange={handleEditInputChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input name="email" value={editForm.email} onChange={handleEditInputChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Industry</label>
              <input name="industry" value={editForm.industry} onChange={handleEditInputChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Location</label>
              <input name="location" value={editForm.location} onChange={handleEditInputChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea name="description" value={editForm.description} onChange={handleEditInputChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1 font-medium">LinkedIn</label>
              <input name="linkedin" value={editForm.linkedin} onChange={handleEditInputChange} className="w-full p-2 border rounded" placeholder="LinkedIn URL" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Portfolio</label>
              <input name="portfolio" value={editForm.portfolio} onChange={handleEditInputChange} className="w-full p-2 border rounded" placeholder="Portfolio URL" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Logo</label>
              <input type="file" accept="image/*" onChange={handleEditLogoChange} />
            </div>
          </form>
        </DialogContent>
        <DialogActions style={{ padding: 24 }}>
          <Button onClick={() => setShowEditModal(false)} color="secondary" variant="outlined">Cancel</Button>
          <Button type="submit" form="edit-profile-form" color="primary" variant="contained">Save Changes</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={editSuccess}
        autoHideDuration={2000}
        onClose={() => setEditSuccess(false)}
        message="Profile updated!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </div>
  );
};

export default CompanyDashboard; 