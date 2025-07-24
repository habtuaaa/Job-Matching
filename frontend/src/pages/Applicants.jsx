import React, { useEffect, useState } from "react";
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

const labelClass = "font-semibold text-gray-700 mr-2";
const valueClass = "text-gray-800";

const STATUS_OPTIONS = [
  { value: "Pending", label: "Pending" },
  { value: "Reviewed", label: "Reviewed" },
  { value: "Accepted", label: "Accepted" },
  { value: "Rejected", label: "Rejected" },
];

const Applicants = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [jobTitleFilter, setJobTitleFilter] = useState("");
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [statusError, setStatusError] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [newMessage, setNewMessage] = useState("");

  const navigate = useNavigate();

  // Get unique job titles for dropdown
  const jobTitles = Array.from(new Set(applications.map(app => app.job_title))).filter(Boolean);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/companies/applicants/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, []);

  useEffect(() => {
    if (selectedApp) {
      setNewStatus(selectedApp.status || "Pending");
      setStatusError("");
    }
  }, [selectedApp]);

  // Fetch messages when dialog opens
  useEffect(() => {
    const fetchMessages = async () => {
      if (!selectedApp) return;
      setMessageLoading(true);
      setMessageError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://127.0.0.1:8000/api/applications/${selectedApp.id}/messages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
      } catch (err) {
        setMessageError("Failed to load messages");
      } finally {
        setMessageLoading(false);
      }
    };
    if (selectedApp) fetchMessages();
  }, [selectedApp]);

  const handleStatusUpdate = async () => {
    if (!selectedApp) return;
    setStatusUpdating(true);
    setStatusError("");
    try {
      const token = localStorage.getItem("token");
      await axios.patch(
        `http://127.0.0.1:8000/api/companies/applicants/${selectedApp.id}/`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update local state
      setApplications(applications =>
        applications.map(app =>
          app.id === selectedApp.id ? { ...app, status: newStatus } : app
        )
      );
      setSelectedApp(app => app ? { ...app, status: newStatus } : app);
    } catch (err) {
      setStatusError(err.response?.data?.detail || "Failed to update status");
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedApp) return;
    setMessageLoading(true);
    setMessageError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://127.0.0.1:8000/api/applications/${selectedApp.id}/messages/`, { text: newMessage }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage("");
      // Refresh messages
      const res = await axios.get(`http://127.0.0.1:8000/api/applications/${selectedApp.id}/messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch (err) {
      setMessageError("Failed to send message");
    } finally {
      setMessageLoading(false);
    }
  };

  // Group applications by job
  const grouped = applications.reduce((acc, app) => {
    const jobId = app.job;
    if (!acc[jobId]) acc[jobId] = [];
    acc[jobId].push(app);
    return acc;
  }, {});

  // Filter groups by job title
  const filteredGroups = Object.entries(grouped).filter(([_jobId, apps]) => {
    if (!jobTitleFilter) return true;
    const title = apps[0]?.job_title || "";
    return title === jobTitleFilter;
  });

  const renderApplicantDetails = (app) => {
    const a = app.applicant;
    const profilePic = a.profile_picture ? `http://127.0.0.1:8000${a.profile_picture}` : null;
    const resumeUrl = a.resume ? `http://127.0.0.1:8000${a.resume}` : null;
    return (
      <div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
        <div className="flex-shrink-0">
          {profilePic ? (
            <img src={profilePic} alt="Profile" className="w-24 h-24 rounded-full object-cover border-4 border-blue-200 shadow" />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center text-3xl text-gray-500 font-bold border-4 border-blue-100 shadow">
              {a.name ? a.name.split(' ').map(w=>w[0]).join('').slice(0,2).toUpperCase() : a.email[0].toUpperCase()}
            </div>
          )}
        </div>
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
          <div>
            <div className="text-xl font-bold text-blue-700 mb-1">{a.name || a.email}</div>
            <div className="text-gray-600 mb-2">{a.email}</div>
            <div><span className={labelClass}>Location:</span><span className={valueClass}>{a.location || 'N/A'}</span></div>
            <div><span className={labelClass}>Phone:</span><span className={valueClass}>{a.phone || 'N/A'}</span></div>
            {/* <div><span className={labelClass}>Education:</span><span className={valueClass}>{a.education || 'N/A'}</span></div> */}
            {/* <div><span className={labelClass}>Experience:</span><span className={valueClass}>{a.experience || 'N/A'}</span></div> */}
          </div>
          <div>
            {/* <div><span className={labelClass}>Skills:</span>{(() => {
              let skillsArr = a.skills;
              if (typeof skillsArr === 'string') {
                try {
                  skillsArr = JSON.parse(skillsArr);
                  if (typeof skillsArr === 'string') {
                    skillsArr = JSON.parse(skillsArr);
                  }
                } catch {
                  skillsArr = [];
                }
              }
              return Array.isArray(skillsArr) && skillsArr.length > 0 ? (
                <ul className="list-disc ml-6 mt-1 text-gray-800">
                  {skillsArr.map((s, i) => <li key={i}>{s}</li>)}
                </ul>
              ) : <span className={valueClass}>N/A</span>;
            })()}</div> */}
            <div className="mt-2 flex flex-col gap-1">
              {a.linkedin && <a href={a.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">LinkedIn</a>}
              {a.portfolio && <a href={a.portfolio} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline font-semibold">Portfolio</a>}
              {resumeUrl && <a href={resumeUrl} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:underline font-semibold">Download Resume</a>}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">Applicants for Your Jobs</h2>
      <div className="max-w-2xl mx-auto mb-8 flex flex-col sm:flex-row gap-4 items-center justify-center">
        <select
          value={jobTitleFilter}
          onChange={e => setJobTitleFilter(e.target.value)}
          className="w-full sm:w-96 p-3 border-2 border-green-300 rounded-lg focus:border-green-500 focus:outline-none shadow"
        >
          <option value="">All Job Titles</option>
          {jobTitles.map((title, idx) => (
            <option key={idx} value={title}>{title}</option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center py-12 text-lg">Loading applicants...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : filteredGroups.length === 0 ? (
        <div className="text-center py-12 text-gray-500">No applicants found for this job title.</div>
      ) : (
        <div className="space-y-10 max-w-4xl mx-auto">
          {filteredGroups.map(([jobId, apps]) => (
            <div key={jobId} className="bg-white rounded-2xl shadow-lg p-8 border-t-4 border-green-400">
              <h3 className="text-xl font-bold mb-6 text-green-700">{apps[0]?.job_title || `Job ID: ${jobId}`}</h3>
              <div className="divide-y">
                {apps.map(app => (
                  <div key={app.id} className="py-6 flex flex-col gap-4">
                    {renderApplicantDetails(app)}
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
                      <div className="flex gap-2">
                        <Button variant="outlined" onClick={() => setSelectedApp(app)}>Details</Button>
                        <Button variant="contained" color="primary" onClick={() => navigate('/messages', { state: { applicationId: app.id } })}>Message</Button>
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${app.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : app.status === 'Accepted' ? 'bg-green-100 text-green-800' : app.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}>{app.status}</span>
                      </div>
                      <div className="text-gray-500 text-xs">Applied: {new Date(app.applied_at).toLocaleString()}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
      <Dialog open={!!selectedApp} onClose={() => setSelectedApp(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Applicant Details</DialogTitle>
        <DialogContent dividers>
          <div className="mb-2 font-semibold text-lg text-blue-800">{selectedApp?.applicant?.name || selectedApp?.applicant?.email}</div>
          <div className="mb-2 text-gray-500 text-sm">Email: {selectedApp?.applicant?.email}</div>
          <div className="mb-4 text-gray-600 text-xs">Applied: {selectedApp ? new Date(selectedApp.applied_at).toLocaleString() : ''}</div>

          {/* Status Update Section */}
          <div className="mb-6 flex items-center gap-4">
            <div className="font-semibold text-base text-green-700">Application Status:</div>
            <select
              className="border rounded px-3 py-1 focus:outline-none focus:ring focus:border-blue-400"
              value={newStatus}
              onChange={e => setNewStatus(e.target.value)}
              disabled={statusUpdating}
            >
              {STATUS_OPTIONS.map(opt => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={handleStatusUpdate}
              disabled={statusUpdating || newStatus === selectedApp?.status}
            >
              {statusUpdating ? "Updating..." : "Update Status"}
            </Button>
          </div>
          {statusError && <div className="text-red-500 mb-4">{statusError}</div>}

          <div className="mb-4">
            <div className="font-semibold text-base text-green-700 mb-1">Education</div>
            <div className="bg-white p-3 rounded border text-gray-800">{selectedApp?.applicant?.education || 'N/A'}</div>
          </div>

          <div className="mb-4">
            <div className="font-semibold text-base text-green-700 mb-1">Experience</div>
            <div className="bg-white p-3 rounded border text-gray-800">{selectedApp?.applicant?.experience || 'N/A'}</div>
          </div>

          <div className="mb-2">
            <div className="font-semibold text-base text-green-700 mb-1">Skills</div>
            <div className="bg-white p-3 rounded border text-gray-800">
              {(() => {
                let skillsArr = selectedApp?.applicant?.skills;
                if (typeof skillsArr === 'string') {
                  try {
                    skillsArr = JSON.parse(skillsArr);
                    if (typeof skillsArr === 'string') {
                      skillsArr = JSON.parse(skillsArr);
                    }
                  } catch {
                    skillsArr = [];
                  }
                }
                return Array.isArray(skillsArr) && skillsArr.length > 0 ? (
                  <ul className="list-disc ml-6 mt-1 text-gray-800">
                    {skillsArr.map((s, i) => <li key={i}>{s}</li>)}
                  </ul>
                ) : <span className={valueClass}>N/A</span>;
              })()}
            </div>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedApp(null)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default Applicants; 