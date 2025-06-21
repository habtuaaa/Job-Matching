import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const JobSeekerDashboard = () => {
  const [userData, setUserData] = useState(null);
  const [error, setError] = useState("");
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
        setError('Failed to load user data');
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
            <h2 className="text-3xl font-bold text-gray-800">Job Seeker Dashboard</h2>
            <button 
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300"
            >
              Logout
            </button>
          </div>
          
          {error && <p className="text-red-500 mb-4">{error}</p>}
          
          {userData ? (
            <div className="space-y-6">
              {/* Profile Section */}
              <div className="border-b-2 border-gray-200 pb-6">
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                    {userData.name?.charAt(0) || 'U'}
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-800 mb-2">
                      {userData.name || 'User'}
                    </h3>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Email:</span> {userData.email}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Location:</span> {userData.location}
                    </p>
                    <p className="text-gray-600 mb-1">
                      <span className="font-semibold">Phone:</span> {userData.phone}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">LinkedIn:</span> {userData.linkedin}
                    </p>
                  </div>
                </div>
              </div>

              {/* Skills Section */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Skills</h3>
                <div className="flex flex-wrap gap-2">
                  {userData.skills && userData.skills.length > 0 ? (
                    userData.skills.map((skill, index) => (
                      <span 
                        key={index}
                        className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500">No skills listed</p>
                  )}
                </div>
              </div>

              {/* Experience Section */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Experience</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{userData.experience || "No experience listed"}</p>
                </div>
              </div>

              {/* Education Section */}
              <div className="mt-6">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Education</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{userData.education || "No education listed"}</p>
                </div>
              </div>

              {/* Portfolio Section */}
              {userData.portfolio && (
                <div className="mt-6">
                  <h3 className="text-xl font-bold text-gray-800 mb-4">Portfolio</h3>
                  <a 
                    href={userData.portfolio} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View Portfolio
                  </a>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4 mt-8">
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                  Edit Profile
                </button>
                <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                  Browse Jobs
                </button>
                <button className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300">
                  View Applications
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">Loading user data...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobSeekerDashboard; 