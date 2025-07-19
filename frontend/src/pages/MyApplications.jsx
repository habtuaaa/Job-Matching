import React, { useEffect, useState } from "react";
import axios from "axios";
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useNavigate } from 'react-router-dom';

const STATUS_COLORS = {
  Pending: "bg-yellow-100 text-yellow-800",
  Reviewed: "bg-blue-100 text-blue-800",
  Accepted: "bg-green-100 text-green-800",
  Rejected: "bg-red-100 text-red-800",
};

const MyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedApp, setSelectedApp] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageLoading, setMessageLoading] = useState(false);
  const [messageError, setMessageError] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/jobs/my-applications/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplications(res.data);
      } catch (err) {
        setError(err.response?.data?.detail || "Failed to load applications");
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleOpenMessages = (app) => {
    navigate('/messages', { state: { applicationId: app.id } });
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-green-50 p-8">
      <h2 className="text-3xl font-bold mb-8 text-center text-blue-700">My Job Applications</h2>
      {loading ? (
        <div className="text-center py-12 text-lg">Loading applications...</div>
      ) : error ? (
        <div className="text-center py-12 text-red-500">{error}</div>
      ) : applications.length === 0 ? (
        <div className="text-center py-12 text-gray-500">You have not applied to any jobs yet.</div>
      ) : (
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b">
                <th className="py-3 px-2 font-semibold text-gray-700">Job Title</th>
                <th className="py-3 px-2 font-semibold text-gray-700">Company</th>
                <th className="py-3 px-2 font-semibold text-gray-700">Status</th>
                <th className="py-3 px-2 font-semibold text-gray-700">Applied At</th>
                <th className="py-3 px-2 font-semibold text-gray-700">Messages</th>
              </tr>
            </thead>
            <tbody>
              {applications.map(app => (
                <tr key={app.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2">{app.job_title || `Job #${app.job}`}</td>
                  <td className="py-3 px-2">{app.company_name || "-"}</td>
                  <td className="py-3 px-2">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${STATUS_COLORS[app.status] || "bg-gray-100 text-gray-800"}`}>{app.status}</span>
                  </td>
                  <td className="py-3 px-2 text-gray-500 text-sm">{new Date(app.applied_at).toLocaleString()}</td>
                  <td className="py-3 px-2">
                    <Button variant="outlined" size="small" onClick={() => handleOpenMessages(app)}>View Messages</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Messaging Dialog */}
      <Dialog open={!!selectedApp} onClose={() => setSelectedApp(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Messages with Company</DialogTitle>
        <DialogContent dividers>
          {messageLoading ? (
            <div className="text-gray-500">Loading messages...</div>
          ) : messageError ? (
            <div className="text-red-500">{messageError}</div>
          ) : (
            <div className="bg-gray-50 p-3 rounded border min-h-[80px] max-h-48 overflow-y-auto flex flex-col gap-2 mb-2">
              {messages.length === 0 ? (
                <div className="text-gray-400">No messages yet.</div>
              ) : messages.map(msg => (
                <div key={msg.id} className={`flex flex-col ${msg.sender_info && msg.sender_info.email === selectedApp?.applicant?.email ? 'items-start' : 'items-end'}`}>
                  <div className={`px-3 py-2 rounded-lg text-sm ${msg.sender_info && msg.sender_info.email === selectedApp?.applicant?.email ? 'bg-blue-100 text-blue-900' : 'bg-green-100 text-green-900'}`}>
                    {msg.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">{msg.sender_info?.name || msg.sender_info?.email} • {new Date(msg.timestamp).toLocaleString()}</div>
                </div>
              ))}
            </div>
          )}
          <div className="flex gap-2 mt-2">
            <TextField
              size="small"
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              value={newMessage}
              onChange={e => setNewMessage(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
              disabled={messageLoading}
            />
            <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={messageLoading || !newMessage.trim()}>Send</Button>
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setSelectedApp(null)} color="primary">Close</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyApplications; 