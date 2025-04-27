import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import JobSeekerProfileSetup from "./Jobseekerprofilesetup/JobSeekerProfileSetup";
import CompanyProfileSetup from "./Companyprofilesetup/CompanyProfileSetup";
import "./Register.css";

function Register() {
  const [userType, setUserType] = useState("job_seeker");
  const navigate = useNavigate(); // For navigation after registration

  // Handle user type selection
  const handleUserTypeChange = (e) => {
    setUserType(e.target.value);
    localStorage.setItem("userType", e.target.value); // Store user type in localStorage
  };

  // Simulated registration function
  const handleRegister = (e) => {
    e.preventDefault();

    // Simulate storing a token
    localStorage.setItem("token", "dummy_token");

    // Redirect user based on their type
    if (userType === "job_seeker") {
      navigate("/dashboard/jobseeker");
    } else {
      navigate("/dashboard/company");
    }
  };

  return (
    <div className="register-container">
      <form className="register-form" onSubmit={handleRegister}>
        <h3>Register</h3>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              value="job_seeker"
              checked={userType === "job_seeker"}
              onChange={handleUserTypeChange}
            />
            Job Seeker
          </label>
          <label>
            <input
              type="radio"
              value="company"
              checked={userType === "company"}
              onChange={handleUserTypeChange}
            />
            Hiring Company
          </label>
        </div>

        {/* Render the appropriate profile setup form */}
        {userType === "job_seeker" ? <JobSeekerProfileSetup /> : <CompanyProfileSetup />}

        <button type="submit" className="register-btn">Register</button>
      </form>
    </div>
  );
}

export default Register;
