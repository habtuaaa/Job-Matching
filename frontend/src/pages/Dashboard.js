import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
/*import './Dashboard.css';*/

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user/', {
          headers: { 'Authorization': `Bearer ${localStorage.getItem("token")}` },
        });
        setUserData(response.data);
      } catch (error) {
        console.error('Failed to fetch user data', error);
        navigate('/login');
      }
    };

    fetchUserData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate('/login');
  };

  return (
    <div className="dashboard-container">
      <h2>Welcome, {userData?.name || 'User'}</h2>
      <p>Email: {userData?.email}</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}

export default Dashboard;
