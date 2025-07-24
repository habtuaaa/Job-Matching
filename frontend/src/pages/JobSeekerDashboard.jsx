import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Snackbar from '@mui/material/Snackbar';
import Chip from '@mui/material/Chip';
import Avatar from '@mui/material/Avatar';
import MessageIcon from '@mui/icons-material/Message';
import Badge from '@mui/material/Badge';
import { useSwipeable } from 'react-swipeable';
import TinderCard from 'react-tinder-card';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// Helper to robustly parse and flatten skills
function parseSkills(skills) {
  let arr = skills;
  if (typeof arr === 'string') {
    try {
      arr = JSON.parse(arr);
    } catch {
      arr = [arr];
    }
  }
  // If the first element is itself a stringified array, parse it
  if (Array.isArray(arr) && arr.length === 1 && typeof arr[0] === 'string' && arr[0].trim().startsWith('[')) {
    try {
      arr = JSON.parse(arr[0]);
    } catch {
      // leave as is
    }
  }
  // Flatten any nested arrays
  if (Array.isArray(arr)) {
    return arr.flatMap(item => Array.isArray(item) ? item : [item]);
  }
  return [];
}

const JobSeekerDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const [showJobsModal, setShowJobsModal] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loadingJobs, setLoadingJobs] = useState(false);
  const [jobsError, setJobsError] = useState("");
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [showSnackbar, setShowSnackbar] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    skills: '',
    experience: '',
    education: '',
    location: '',
    phone: '',
    linkedin: '',
    portfolio: '',
    resume: null,
    profile_picture: null,
  });
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState(false);
  const [editSkillsInput, setEditSkillsInput] = useState('');
  const [editSkillsList, setEditSkillsList] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  const [applyLoading, setApplyLoading] = useState(false);
  const [applyError, setApplyError] = useState("");
  const [applySuccess, setApplySuccess] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axios.get('http://127.0.0.1:8000/api/auth/profile/', {
          headers: { 'Authorization': `Bearer ${token}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        setError('Failed to load user data');
      }
    };

    fetchUserData();
  }, [navigate]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showJobsModal) return;
      if (e.key === 'ArrowRight') handleNextJob();
      if (e.key === 'ArrowLeft') handlePrevJob();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showJobsModal, jobs, currentJobIndex]);

  useEffect(() => {
    if (userData) {
      setEditForm({
        name: userData.name || '',
        skills: '',
        experience: userData.experience || '',
        education: userData.education || '',
        location: userData.location || '',
        phone: userData.phone || '',
        linkedin: userData.linkedin || '',
        portfolio: userData.portfolio || '',
        resume: null,
        profile_picture: null,
      });
      setEditSkillsList(parseSkills(userData.skills));
    }
  }, [userData]);

  useEffect(() => {
    const fetchUnread = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/messages/unread-count/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUnreadCount(res.data.unread_count);
      } catch {}
    };
    fetchUnread();
    const interval = setInterval(fetchUnread, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  const handleBrowseJobs = async () => {
    setShowJobsModal(true);
    setLoadingJobs(true);
    setJobsError("");
    setCurrentJobIndex(0);
    try {
      const res = await axios.get('http://127.0.0.1:8000/api/jobs/');
      setJobs(res.data);
    } catch (err) {
      setJobsError('Failed to load jobs');
    } finally {
      setLoadingJobs(false);
    }
  };

  const handleNextJob = () => {
    setCurrentJobIndex((prev) => (prev + 1 < jobs.length ? prev + 1 : 0));
    setSwipedCount((prev) => (prev + 1 < jobs.length ? prev + 1 : 0));
  };

  const handlePrevJob = () => {
    setCurrentJobIndex((prev) => (prev - 1 >= 0 ? prev - 1 : jobs.length - 1));
    setSwipedCount((prev) => (prev - 1 >= 0 ? prev - 1 : jobs.length - 1));
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditResumeChange = (e) => {
    setEditForm((prev) => ({ ...prev, resume: e.target.files[0] }));
  };

  const handleEditProfilePictureChange = (e) => {
    setEditForm((prev) => ({ ...prev, profile_picture: e.target.files[0] }));
  };

  const handleAddEditSkill = () => {
    const skill = editSkillsInput.trim();
    if (skill && !editSkillsList.includes(skill)) {
      setEditSkillsList(prev => [
        ...parseSkills(prev),
        skill
      ]);
      setEditSkillsInput('');
    }
  };

  const handleRemoveEditSkill = (idx) => {
    setEditSkillsList(prev => prev.filter((_, i) => i !== idx));
  };

  const handleEditProfile = async (e) => {
    e.preventDefault();
    setEditError('');
    try {
      const token = localStorage.getItem('token');
      const form = new FormData();
      form.append('name', editForm.name);
      form.append('skills', JSON.stringify(editSkillsList));
      form.append('experience', editForm.experience);
      form.append('education', editForm.education);
      form.append('location', editForm.location);
      form.append('phone', editForm.phone);
      form.append('linkedin', editForm.linkedin);
      form.append('portfolio', editForm.portfolio);
      if (editForm.resume) form.append('resume', editForm.resume);
      if (editForm.profile_picture) form.append('profile_picture', editForm.profile_picture);
      const res = await axios.put('http://127.0.0.1:8000/api/auth/update/', form, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUserData(res.data);
      setShowEditModal(false);
      setEditSuccess(true);
    } catch (err) {
      setEditError(err.response?.data?.detail || 'Failed to update profile');
    }
  };

  const handleApplyOnCard = async (job) => {
    setApplyLoading(true);
    setApplyError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://127.0.0.1:8000/api/jobs/${job.id}/apply/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setApplySuccess(true);
    } catch (err) {
      setApplyError(
        err.response?.data?.detail || "Failed to apply for job."
      );
    } finally {
      setApplyLoading(false);
    }
  };

  const [swipedCount, setSwipedCount] = useState(0);

  useEffect(() => {
    if (showJobsModal) {
      setSwipedCount(0);
    }
  }, [showJobsModal, jobs]);

  const handleSwipe = (direction, index) => {
    setSwipedCount((prev) => prev + 1);
    setCurrentJobIndex((prev) => (prev + 1 < jobs.length ? prev + 1 : 0));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-2 sm:p-4 md:p-8">
      <style>
        {`
          @media (max-width: 1023px) {
            .nav-arrows {
              display: none;
            }
          }
        `}
      </style>
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-4 sm:p-6 md:p-8">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6 gap-4">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Job Seeker Dashboard</h2>
            <div className="flex items-center gap-4">
              <Badge badgeContent={unreadCount} color="error">
                <MessageIcon style={{ cursor: 'pointer', fontSize: 32 }} onClick={() => navigate('/messages')} />
              </Badge>
              <button 
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 w-full sm:w-auto"
              >
                Logout
              </button>
            </div>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {userData ? (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="border-b-2 border-gray-200 pb-6">
                <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
                  {userData.profile_picture ? (
                    <img
                      src={`http://127.0.0.1:8000${userData.profile_picture}`}
                      alt="Profile"
                      className="w-24 h-24 rounded-full object-cover border-2 border-green-500"
                    />
                  ) : (
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                      {userData.name?.charAt(0) || 'U'}
                    </div>
                  )}
                  <div className="flex-1 w-full">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                      {userData.name || 'User'}
                    </h3>
                    <p className="text-gray-600 mb-1"><span className="font-semibold">Email:</span> {userData.email}</p>
                    <p className="text-gray-600 mb-1"><span className="font-semibold">Location:</span> {userData.location}</p>
                    <p className="text-gray-600 mb-1"><span className="font-semibold">Phone:</span> {userData.phone}</p>
                    <p className="text-gray-600"><span className="font-semibold">LinkedIn:</span> {userData.linkedin ? (
                      <a href={userData.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{userData.linkedin}</a>
                    ) : 'Not provided'}</p>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mt-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.skills && parseSkills(userData.skills).length > 0 ? (
                    <ul className="list-disc ml-6">
                      {parseSkills(userData.skills).map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Experience Section */}
              <div className="mt-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Experience</h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-gray-700">{userData.experience || "No experience listed"}</p>
                </div>
              </div>

              {/* Education Section */}
              <div className="mt-6">
                <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Education</h3>
                <div className="bg-gray-50 p-3 sm:p-4 rounded-lg">
                  <p className="text-gray-700">{userData.education || "No education listed"}</p>
                </div>
              </div>

              {/* Portfolio Section */}
              {userData.portfolio && (
                <div className="mt-6">
                  <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Portfolio</h3>
                  <a href={userData.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">View Portfolio</a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mt-8">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full sm:w-auto" onClick={() => setShowEditModal(true)}>Edit Profile</button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full sm:w-auto" onClick={handleBrowseJobs}>Browse Jobs</button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full sm:w-auto" onClick={() => navigate('/my-applications')}>View Applications</button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading user data...</p>
            </div>
          )}
        </div>
      </div>
      <Dialog
        open={showJobsModal}
        onClose={() => setShowJobsModal(false)}
        fullScreen
        PaperProps={{ style: { borderRadius: 0, padding: 0, height: '100vh', maxHeight: '100vh', width: '100vw', maxWidth: '100vw' } }}
      >
        <DialogTitle className="text-2xl font-bold text-center">Browse Jobs</DialogTitle>
        <DialogContent dividers style={{ padding: 0, height: 'calc(100vh - 64px)', maxHeight: 'calc(100vh - 64px)' }}>
          {loadingJobs ? (
            <div className="text-center py-8 text-lg">Loading jobs...</div>
          ) : jobsError ? (
            <div className="text-center py-8 text-red-500">{jobsError}</div>
          ) : jobs.length === 0 ? (
            <div className="flex flex-col items-center py-12">
              <span className="text-6xl mb-4">🔍</span>
              <div className="text-center text-gray-500 text-lg">No jobs available.<br/>Check back soon!</div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center relative w-full h-full min-h-0" style={{ height: '100%', minHeight: 0 }}>
              <div className="relative w-full h-full flex-1">
                {jobs[swipedCount] && (
                  <TinderCard
                    key={jobs[swipedCount].id}
                    className="absolute w-full h-full flex justify-center items-center"
                    onSwipe={(dir) => handleSwipe(dir, swipedCount)}
                    preventSwipe={['up', 'down']}
                  >
                    <div className="bg-gray-50 shadow w-full h-full flex flex-col items-center overflow-y-auto" style={{ borderRadius: 0, height: '100%', maxHeight: '100%', minHeight: 0 }}>
                      <div className="w-full flex flex-col items-center p-6">
                        <div className="flex items-center gap-4 mb-4">
                          {jobs[swipedCount].company_info?.logo ? (
                            <Avatar src={`http://127.0.0.1:8000${jobs[swipedCount].company_info.logo}`} sx={{ width: 56, height: 56 }} />
                          ) : (
                            <Avatar sx={{ bgcolor: '#1976d2', width: 56, height: 56, fontSize: 28 }}>{jobs[swipedCount].company_info?.company_name?.split(' ').map(w => w[0]).join('').slice(0,2).toUpperCase() || 'C'}</Avatar>
                          )}
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-blue-700 mb-1">{jobs[swipedCount].title}</h3>
                            <span className="text-gray-600 font-semibold">{jobs[swipedCount].company_info?.company_name}</span>
                          </div>
                          <div className="flex flex-col gap-2 items-end">
                            <Chip label={jobs[swipedCount].employment_type} color="primary" size="small" />
                            {jobs[swipedCount].is_remote && <Chip label="Remote" color="success" size="small" />}
                          </div>
                        </div>
                        <div className="mb-2 text-gray-700">{jobs[swipedCount].description}</div>
                        <div className="mb-2 text-sm text-gray-500">Posted: {new Date(jobs[swipedCount].posted_at).toLocaleDateString()}</div>
                        <Divider className="my-2" />
                        <div className="mb-2">
                          <span className="font-semibold">Location:</span> {jobs[swipedCount].location} {jobs[swipedCount].is_remote && <span className="ml-2 text-green-600">(Remote)</span>}
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold">Experience Level:</span> {jobs[swipedCount].experience_level}
                        </div>
                        <div className="mb-2">
                          <span className="font-semibold">Salary:</span> {jobs[swipedCount].salary_type === 'Negotiable' ? 'Negotiable' : `${jobs[swipedCount].salary_min || ''}${jobs[swipedCount].salary_type === 'Range' ? ' - ' + jobs[swipedCount].salary_max : ''}`}
                        </div>
                        {jobs[swipedCount].requirements && jobs[swipedCount].requirements.length > 0 && (
                          <div className="mb-2">
                            <span className="font-semibold">Requirements:</span>
                            <ul className="list-disc ml-6">
                              {jobs[swipedCount].requirements.map((req, idx) => <li key={idx}>{req}</li>)}
                            </ul>
                          </div>
                        )}
                        {jobs[swipedCount].benefits && jobs[swipedCount].benefits.length > 0 && (
                          <div className="mb-2">
                            <span className="font-semibold">Benefits:</span>
                            <ul className="list-disc ml-6">
                              {jobs[swipedCount].benefits.map((ben, idx) => <li key={idx}>{ben}</li>)}
                            </ul>
                          </div>
                        )}
                        {jobs[swipedCount].company_info && (
                          <div className="mt-2 text-sm text-gray-500">
                            <span className="font-semibold">About {jobs[swipedCount].company_info.company_name}:</span> {jobs[swipedCount].company_info.description} <span className="ml-2">({jobs[swipedCount].company_info.industry})</span>
                            {(jobs[swipedCount].company_info.linkedin || jobs[swipedCount].company_info.portfolio) && (
                              <div className="flex flex-col gap-1 mt-1">
                                {jobs[swipedCount].company_info.linkedin && (
                                  <div>
                                    <span className="font-semibold">LinkedIn:</span> <a href={jobs[swipedCount].company_info.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{jobs[swipedCount].company_info.linkedin}</a>
                                  </div>
                                )}
                                {jobs[swipedCount].company_info.portfolio && (
                                  <div>
                                    <span className="font-semibold">Portfolio:</span> <a href={jobs[swipedCount].company_info.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 underline">{jobs[swipedCount].company_info.portfolio}</a>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  </TinderCard>
                )}
                {swipedCount >= jobs.length && (
                  <div className="flex flex-col items-center justify-center h-full w-full absolute top-0 left-0 bg-white z-10">
                    <span className="text-6xl mb-4">🎉</span>
                    <div className="text-center text-gray-500 text-lg">No more jobs to browse.<br/>Check back soon!</div>
                  </div>
                )}
                {/* Navigation Arrows */}
                {jobs.length > 0 && swipedCount < jobs.length && (
                  <div className="nav-arrows absolute top-1/2 transform -translate-y-1/2 w-full flex justify-between px-4">
                    <Button
                      onClick={handlePrevJob}
                      disabled={swipedCount === 0}
                      sx={{ minWidth: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }}
                    >
                      <ArrowBackIosIcon />
                    </Button>
                    <Button
                      onClick={handleNextJob}
                      disabled={swipedCount >= jobs.length - 1}
                      sx={{ minWidth: 48, height: 48, borderRadius: '50%', backgroundColor: 'rgba(0, 0, 0, 0.5)', color: 'white', '&:hover': { backgroundColor: 'rgba(0, 0, 0, 0.7)' } }}
                    >
                      <ArrowForwardIosIcon />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
        <DialogActions style={{ padding: 24 }}>
          <Button
            color="primary"
            variant="contained"
            disabled={!jobs[swipedCount] || applyLoading}
            onClick={() => jobs[swipedCount] && handleApplyOnCard(jobs[swipedCount])}
          >
            {applyLoading ? "Applying..." : "Apply"}
          </Button>
          <Button onClick={() => setShowJobsModal(false)} color="secondary" variant="outlined">Close</Button>
        </DialogActions>
      </Dialog>
      <Snackbar
        open={applySuccess}
        autoHideDuration={2000}
        onClose={() => setApplySuccess(false)}
        message="Application submitted!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Snackbar
        open={!!applyError}
        autoHideDuration={4000}
        onClose={() => setApplyError("")}
        message={applyError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        ContentProps={{ sx: { backgroundColor: '#d32f2f' } }} // Red background for error
      />
      <Dialog
        open={showEditModal}
        onClose={() => setShowEditModal(false)}
        maxWidth="sm"
        fullWidth
        scroll="paper"
        PaperProps={{ style: { borderRadius: 16, padding: 0 } }}
      >
        <DialogTitle className="text-2xl font-bold text-center">Edit Profile</DialogTitle>
        <DialogContent dividers style={{ padding: 32 }}>
          <form id="edit-profile-form" onSubmit={handleEditProfile} className="space-y-6">
            {editError && <p className="text-red-500 mb-2">{editError}</p>}
            <div>
              <label className="block mb-1 font-medium">Full Name</label>
              <input name="name" value={editForm.name} onChange={handleEditInputChange} className="w-full p-2 border rounded" required />
            </div>
            <div>
              <label className="block mb-1 font-medium">Skills</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={editSkillsInput}
                  onChange={e => setEditSkillsInput(e.target.value)}
                  placeholder="Add a skill"
                  className="flex-1 p-2 border rounded"
                />
                <button type="button" onClick={handleAddEditSkill} className="bg-green-500 text-white px-3 py-1 rounded">+</button>
              </div>
              <div className="flex flex-wrap gap-2 mb-4">
                {editSkillsList.map((skill, idx) => (
                  <span key={idx} className="bg-green-100 text-green-800 px-3 py-1 rounded-full flex items-center">
                    {skill}
                    <button type="button" onClick={() => handleRemoveEditSkill(idx)} className="ml-2 text-red-500">×</button>
                  </span>
                ))}
              </div>
            </div>
            <div>
              <label className="block mb-1 font-medium">Experience</label>
              <textarea name="experience" value={editForm.experience} onChange={handleEditInputChange} className="w-full p-2 border rounded" rows="3" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Education</label>
              <textarea name="education" value={editForm.education} onChange={handleEditInputChange} className="w-full p-2 border rounded" rows="3" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Location</label>
              <input name="location" value={editForm.location} onChange={handleEditInputChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Phone</label>
              <input name="phone" value={editForm.phone} onChange={handleEditInputChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1 font-medium">LinkedIn</label>
              <input name="linkedin" value={editForm.linkedin} onChange={handleEditInputChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Portfolio</label>
              <input name="portfolio" value={editForm.portfolio} onChange={handleEditInputChange} className="w-full p-2 border rounded" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Resume</label>
              <input type="file" accept=".pdf,.doc,.docx,.txt" onChange={handleEditResumeChange} className="w-full" />
            </div>
            <div>
              <label className="block mb-1 font-medium">Profile Picture</label>
              <input type="file" accept="image/*" onChange={handleEditProfilePictureChange} className="w-full" />
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

export default JobSeekerDashboard;