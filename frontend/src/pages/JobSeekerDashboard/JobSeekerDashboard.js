import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const JobSeekerDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchUserProfile = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("No token found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/profile/", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.status === 200) {
          setUser(response.data);
        } else {
          setError("Failed to load profile. Unexpected response status.");
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        if (error.response) {
          if (error.response.status === 401) {
            setError("Unauthorized. Please log in again.");
          } else if (error.response.status === 403) {
            setError("Forbidden. You do not have permission to access this resource.");
          } else {
            setError("An error occurred while fetching the profile.");
          }
        } else {
          setError("Network error. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Welcome, {user?.name || "User"}!</h2>
      {error && <p>{error}</p>}
      {user && (
        <div>
          <h3>Your Profile</h3>
          <p><strong>Name:</strong> {user.name || "Not provided"}</p>
          <p><strong>Skills:</strong> {user.skills?.join(", ") || "Not provided"}</p>
          <p><strong>Experience:</strong> {user.experience || "Not provided"}</p>
          <p><strong>Location:</strong> {user.location || "Not provided"}</p>
          <p><strong>Phone:</strong> {user.phone || "Not provided"}</p>
          <p><strong>LinkedIn:</strong> 
            {user.linkedin ? (
              <a href={user.linkedin} target="_blank" rel="noopener noreferrer">{user.linkedin}</a>
            ) : "Not provided"}
          </p>
          <p><strong>Portfolio:</strong> 
            {user.portfolio ? (
              <a href={user.portfolio} target="_blank" rel="noopener noreferrer">{user.portfolio}</a>
            ) : "Not provided"}
          </p>
          <button onClick={() => navigate("/jobseeker/profile/edit")}>Edit Profile</button>
          <button onClick={handleLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};

export default JobSeekerDashboard;
