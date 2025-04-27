import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBriefcase, FaUserTie } from 'react-icons/fa';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  
  // Check if the user is authenticated (Example: using localStorage)
  const isAuthenticated = localStorage.getItem("token");
  const handleRegisterClick = (userType) => {
    if (!isAuthenticated) {
      alert("Please sign up or log in before registering.");
      navigate("/login");
    } else {
      navigate(`/register?user_type=${userType}`);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1>Welcome to JobMatch</h1>
        <p>Your personalized job matching platform</p>
      </header>
      <main className="home-main">
        <section className="home-options">
          <div className="option-card">
            <FaUserTie size={50} color="#4CAF50" />
            <h2>Looking for a Job?</h2>
            <p>Swipe through job listings tailored to your profile.</p>
            <button onClick={() => handleRegisterClick("job_seeker")}>
              Get Started
            </button>
          </div>
          <div className="option-card">
            <FaBriefcase size={50} color="#4CAF50" />
            <h2>Hiring?</h2>
            <p>Find qualified candidates who match your job postings.</p>
            <button onClick={() => handleRegisterClick("company")}>
              Post a Job
            </button>
          </div>
        </section>
      </main>
      <footer className="home-footer">
        <p>&copy; 2025 JobMatch. All rights reserved.</p>
      </footer>

      {/* Login and Sign Up Buttons */}
      <div className="auth-buttons">
        {!isAuthenticated ? (
          <>
            <Link to="/login">
              <button className="login-btn">Login</button>
            </Link>
            <Link to="/signup">
              <button className="sign-up-btn">Sign Up</button>
            </Link>
          </>
        ) : (
          <button onClick={() => { localStorage.removeItem("token"); navigate("/"); }}>
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Home;
