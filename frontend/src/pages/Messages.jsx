import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, List, ListItem, ListItemText, ListItemAvatar, Avatar, Badge, Divider, Typography, IconButton, TextField, Button, CircularProgress } from '@mui/material';
import MessageIcon from '@mui/icons-material/Message';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMediaQuery from '@mui/material/useMediaQuery';

const Messages = () => {
  const [threads, setThreads] = useState([]);
  const [selectedThread, setSelectedThread] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingThreads, setLoadingThreads] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [messageError, setMessageError] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useMediaQuery('(max-width: 600px)');
  const [showSidebar, setShowSidebar] = useState(true);

  // Fetch threads
  useEffect(() => {
    const fetchThreads = async () => {
      setLoadingThreads(true);
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://127.0.0.1:8000/api/messages/threads/", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setThreads(res.data);
      } catch {}
      setLoadingThreads(false);
    };
    fetchThreads();
    const interval = setInterval(fetchThreads, 10000);
    return () => clearInterval(interval);
  }, []);

  // Auto-select thread if applicationId is passed in location.state
  useEffect(() => {
    if (location.state && location.state.applicationId && threads.length > 0) {
      const thread = threads.find(t => t.application_id === location.state.applicationId);
      if (thread) setSelectedThread(thread);
    }
    // eslint-disable-next-line
  }, [location.state, threads]);

  // Fetch unread count
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
    const interval = setInterval(fetchUnread, 10000);
    return () => clearInterval(interval);
  }, []);

  // Fetch messages for selected thread
  useEffect(() => {
    if (!selectedThread) return;
    const fetchMessages = async () => {
      setLoadingMessages(true);
      setMessageError("");
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(`http://127.0.0.1:8000/api/applications/${selectedThread.application_id}/messages/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessages(res.data);
        // Mark as read
        await axios.post(`http://127.0.0.1:8000/api/applications/${selectedThread.application_id}/mark-read/`, {}, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch {
        setMessageError("Failed to load messages");
      }
      setLoadingMessages(false);
    };
    fetchMessages();
    const interval = setInterval(fetchMessages, 10000);
    return () => clearInterval(interval);
  }, [selectedThread]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedThread) return;
    setMessageError("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://127.0.0.1:8000/api/applications/${selectedThread.application_id}/messages/`, { text: newMessage }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNewMessage("");
      // Refresh messages
      const res = await axios.get(`http://127.0.0.1:8000/api/applications/${selectedThread.application_id}/messages/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessages(res.data);
    } catch {
      setMessageError("Failed to send message");
    }
  };

  // Responsive: show sidebar or chat area on mobile
  useEffect(() => {
    if (isMobile) {
      if (selectedThread) setShowSidebar(false);
      else setShowSidebar(true);
    } else {
      setShowSidebar(true);
    }
  }, [isMobile, selectedThread]);

  return (
    <Box sx={{ display: 'flex', height: '100vh', background: 'linear-gradient(to bottom right, #e0f2fe, #f0fdf4)' }}>
      {/* Sidebar */}
      {(!isMobile || showSidebar) && (
        <Box sx={{ width: { xs: '100vw', sm: 340 }, bgcolor: 'white', borderRight: { sm: 1 }, borderColor: 'divider', display: 'flex', flexDirection: 'column', position: { xs: 'absolute', sm: 'static' }, zIndex: 10, height: '100vh' }}>
          <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, borderBottom: 1, borderColor: 'divider' }}>
            <MessageIcon color="primary" sx={{ fontSize: 32 }} />
            <Typography variant="h6" fontWeight={700}>Messages</Typography>
            <Badge badgeContent={unreadCount} color="error" sx={{ ml: 'auto' }} />
          </Box>
          {loadingThreads ? (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CircularProgress />
            </Box>
          ) : (
            <List sx={{ flex: 1, overflowY: 'auto' }}>
              {threads.length === 0 ? (
                <ListItem><ListItemText primary="No conversations yet." /></ListItem>
              ) : threads.map(thread => (
                <React.Fragment key={thread.application_id}>
                  <ListItem button selected={selectedThread && selectedThread.application_id === thread.application_id} onClick={() => { setSelectedThread(thread); if (isMobile) setShowSidebar(false); }} alignItems="flex-start">
                    <ListItemAvatar>
                      <Avatar>{thread.other_user.name ? thread.other_user.name[0] : thread.other_user.email[0]}</Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={<span style={{ fontWeight: thread.unread_count > 0 ? 700 : 400 }}>{thread.other_user.name || thread.other_user.email}</span>}
                      secondary={<>
                        <span style={{ fontWeight: thread.unread_count > 0 ? 700 : 400 }}>{thread.job_title}</span><br />
                        <span style={{ color: '#666' }}>{thread.last_message ? thread.last_message.slice(0, 40) : 'No messages yet.'}</span>
                      </>}
                    />
                    {thread.unread_count > 0 && <Badge badgeContent={thread.unread_count} color="error" />}
                  </ListItem>
                  <Divider component="li" />
                </React.Fragment>
              ))}
            </List>
          )}
        </Box>
      )}
      {/* Main Chat Area */}
      {(!isMobile || !showSidebar) && (
        <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', position: { xs: 'absolute', sm: 'static' }, width: { xs: '100vw', sm: 'auto' }, left: { xs: showSidebar ? '100vw' : 0, sm: 0 }, transition: 'left 0.3s' }}>
          {isMobile && (
            <Box sx={{ p: 1, borderBottom: 1, borderColor: 'divider', display: 'flex', alignItems: 'center', gap: 2 }}>
              <IconButton onClick={() => { setShowSidebar(true); setSelectedThread(null); }}>
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h6" fontWeight={700}>Chat</Typography>
            </Box>
          )}
          {selectedThread ? (
            <>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider', display: { xs: 'none', sm: 'flex' }, alignItems: 'center', gap: 2 }}>
                <Avatar>{selectedThread.other_user.name ? selectedThread.other_user.name[0] : selectedThread.other_user.email[0]}</Avatar>
                <Typography variant="h6" fontWeight={700}>{selectedThread.other_user.name || selectedThread.other_user.email}</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>{selectedThread.job_title}</Typography>
              </Box>
              <Box sx={{ flex: 1, overflowY: 'auto', p: 3, bgcolor: '#f8fafc', display: 'flex', flexDirection: 'column', gap: 2 }}>
                {loadingMessages ? (
                  <CircularProgress />
                ) : messageError ? (
                  <Typography color="error">{messageError}</Typography>
                ) : messages.length === 0 ? (
                  <Typography color="text.secondary">No messages yet.</Typography>
                ) : messages.map(msg => (
                  <Box key={msg.id} sx={{ alignSelf: msg.sender_info && msg.sender_info.email === selectedThread.other_user.email ? 'flex-start' : 'flex-end', maxWidth: '70%' }}>
                    <Box sx={{ px: 2, py: 1, borderRadius: 2, bgcolor: msg.sender_info && msg.sender_info.email === selectedThread.other_user.email ? '#e0e7ff' : '#bbf7d0', color: '#222', fontSize: 16 }}>
                      {msg.text}
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>{msg.sender_info?.name || msg.sender_info?.email} • {new Date(msg.timestamp).toLocaleString()}</Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex', gap: 2 }}>
                <TextField
                  size="small"
                  fullWidth
                  variant="outlined"
                  placeholder="Type a message..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSendMessage(); }}
                />
                <Button variant="contained" color="primary" onClick={handleSendMessage} disabled={!newMessage.trim()}>Send</Button>
              </Box>
            </>
          ) : (
            <Box sx={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Typography color="text.secondary">Select a conversation to start messaging.</Typography>
            </Box>
          )}
        </Box>
      )}
    </Box>
  );
};

export default Messages; 