import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Dashboard() {
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">
              Welcome, {userData?.name || 'User'}
            </h2>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Logout
            </button>
          </div>
          
          {userData && (
            <div className="space-y-4">
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Email:</span> {userData.email}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Location:</span> {userData.location}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Phone:</span> {userData.phone}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">LinkedIn:</span> {userData.linkedin}
              </p>
              <p className="text-lg text-gray-600">
                <span className="font-semibold">Portfolio:</span> {userData.portfolio}
              </p>
              <div className="text-lg text-gray-600">
                <span className="font-semibold">Skills:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {userData.skills && userData.skills.length > 0 ? (
                    userData.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <span className="text-gray-500">No skills listed</span>
                  )}
                </div>
              </div>
              <div className="text-lg text-gray-600">
                <span className="font-semibold">Experience:</span>
                <p className="mt-2 text-gray-700">{userData.experience}</p>
              </div>
              <div className="text-lg text-gray-600">
                <span className="font-semibold">Education:</span>
                <p className="mt-2 text-gray-700">{userData.education}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Dashboard; 