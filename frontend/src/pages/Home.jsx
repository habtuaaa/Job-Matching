import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBriefcase, FaUserTie } from 'react-icons/fa';

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
    <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-8">
      {/* Header */}
      <header className="bg-green-700 text-white p-6 rounded-lg shadow-lg mb-8 w-full max-w-4xl text-center">
        <h1 className="text-4xl font-bold mb-2">Welcome to JobMatch</h1>
        <p className="text-xl">Your personalized job matching platform</p>
      </header>

      {/* Main Content */}
      <main className="w-full max-w-6xl">
        <section className="flex justify-center gap-8 flex-wrap">
          {/* Job Seeker Card */}
          <div className="bg-white p-8 rounded-lg shadow-lg w-80 min-h-64 text-center border-t-4 border-green-500 flex flex-col justify-between">
            <div>
              <FaUserTie className="text-5xl text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-4">Looking for a Job?</h2>
              <p className="text-gray-600 mb-6">Swipe through job listings tailored to your profile.</p>
            </div>
            <button 
              onClick={() => handleRegisterClick("job_seeker")}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full"
            >
              Get Started
            </button>
          </div>

          {/* Company Card */}
          <div className="bg-white p-8 rounded-lg shadow-lg w-80 min-h-64 text-center border-t-4 border-green-500 flex flex-col justify-between">
            <div>
              <FaBriefcase className="text-5xl text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-700 mb-4">Hiring?</h2>
              <p className="text-gray-600 mb-6">Find qualified candidates who match your job postings.</p>
            </div>
            <button 
              onClick={() => handleRegisterClick("company")}
              className="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-lg transition-colors duration-300 w-full"
            >
              Post a Job
            </button>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="mt-12 text-green-700 font-bold text-sm">
        <p>&copy; 2025 JobMatch. All rights reserved.</p>
      </footer>

      {/* Authentication Buttons */}
      <div className="fixed bottom-6 right-6 flex gap-4">
        {!isAuthenticated ? (
          <>
            <Link to="/login">
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 shadow-lg w-48">
                Login
              </button>
            </Link>
            <Link to="/signup">
              <button className="bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 shadow-lg w-48">
                Sign Up
              </button>
            </Link>
          </>
        ) : (
          <button 
            onClick={() => { 
              localStorage.removeItem("token"); 
              navigate("/"); 
            }}
            className="bg-red-500 hover:bg-red-600 text-white font-bold py-4 px-8 rounded-lg transition-colors duration-300 shadow-lg"
          >
            Logout
          </button>
        )}
      </div>
    </div>
  );
};

export default Home; 