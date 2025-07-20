import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Contact from './pages/Contact';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CompanyDashboard from './pages/CompanyDashboard';
import JobSeekerDashboard from './pages/JobSeekerDashboard';
import CompanyProfileSetup from './pages/CompanyProfileSetup';
import JobSeekerProfileSetup from './pages/JobSeekerProfileSetup';
import Applicants from './pages/Applicants';
import MyApplications from './pages/MyApplications';
import Messages from './pages/Messages';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/register" element={<Register />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/company-dashboard" element={<CompanyDashboard />} />
      <Route path="/jobseeker-dashboard" element={<JobSeekerDashboard />} />
      <Route path="/company-profile-setup" element={<CompanyProfileSetup />} />
      <Route path="/jobseeker-profile-setup" element={<JobSeekerProfileSetup />} />
      <Route path="/applicants" element={<Applicants />} />
      <Route path="/my-applications" element={<MyApplications />} />
      <Route path="/messages" element={<Messages />} />
    </Routes>
    <Footer />
  </Router>
);

export default App; 