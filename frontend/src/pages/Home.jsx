import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaBriefcase, FaUserTie, FaShieldAlt, FaChartBar, FaCheckCircle, FaLock, FaComments, FaArrowRight, FaSearch } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import heroImg from '../assets/Networking.jpg';
import feature1 from '../assets/4.jpg';
import feature2 from '../assets/6.jpg';
import feature3 from '../assets/8.jpg';
import feature4 from '../assets/2.jpg';
import aboutImg from '../assets/6.jpg'; // Changed image for mission section

const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'Software Engineer',
    text: 'JobMatch helped me find my dream job in just two weeks! The process was smooth and the matches were spot on.',
    img: feature1,
  },
  {
    name: 'Acme Corp',
    role: 'HR Manager',
    text: 'We found several top candidates quickly. The communication tools made the hiring process seamless.',
    img: feature2,
  },
  {
    name: 'Michael Lee',
    role: 'Data Analyst',
    text: 'The personalized job recommendations saved me so much time. Highly recommended!',
    img: feature3,
  },
];

const stats = [
  { icon: <FaChartBar className="text-5xl text-green-600" />, label: 'Jobs Posted', value: '2,500+' },
  { icon: <FaUserTie className="text-5xl text-green-600" />, label: 'Candidates', value: '8,000+' },
  { icon: <FaBriefcase className="text-5xl text-green-600" />, label: 'Companies', value: '500+' },
  { icon: <FaCheckCircle className="text-5xl text-green-600" />, label: 'Matches Made', value: '1,200+' },
];

// Animation variants (same as before)
const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2 * i,
      duration: 0.8,
      ease: 'easeOut',
    },
  }),
};
const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
};
const heroVariants = {
  hidden: { opacity: 0, scale: 0.98 },
  visible: { opacity: 1, scale: 1, transition: { duration: 1, ease: 'easeOut' } },
};
const bgVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 0.85, transition: { duration: 1.2, ease: 'easeOut' } },
};

const features = [
  {
    title: 'Personalized Matches',
    desc: 'Advanced algorithms connect you with jobs and candidates that fit your unique profile.',
    icon: <FaUserTie className="text-green-600 text-4xl mb-2" />,
    img: feature1,
  },
  {
    title: 'Secure & Private',
    desc: 'Your data is protected with industry-leading security and privacy standards.',
    icon: <FaLock className="text-green-600 text-4xl mb-2" />,
    img: feature2,
  },
  {
    title: 'Easy Communication',
    desc: 'Message directly within the platform to streamline your hiring or job search process.',
    icon: <FaComments className="text-green-600 text-4xl mb-2" />,
    img: feature3,
  },
  {
    title: 'Verified Companies',
    desc: 'Work with trusted, verified companies for a safe job search experience.',
    icon: <FaShieldAlt className="text-green-600 text-4xl mb-2" />,
    img: feature4,
  },
];

// Carousel state for testimonials
import { useState } from 'react';

const Home = () => {
  const navigate = useNavigate();
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const handleRegisterClick = (userType) => {
      navigate("/login");
  };

  // How It Works steps
  const seekerSteps = [
    {
      icon: <FaUserTie className="text-green-600 text-4xl" />,
      title: 'Create Profile',
      desc: 'Sign up and build your professional profile.',
    },
    {
      icon: <FaSearch className="text-green-600 text-4xl" />,
      title: 'Find Jobs',
      desc: 'Browse and get matched to relevant jobs instantly.',
    },
    {
      icon: <FaComments className="text-green-600 text-4xl" />,
      title: 'Connect',
      desc: 'Message and connect with employers directly.',
    },
    {
      icon: <FaBriefcase className="text-green-600 text-4xl" />,
      title: 'Get Hired',
      desc: 'Land your dream job and start your new journey.',
    },
  ];
  const companySteps = [
    {
      icon: <FaBriefcase className="text-green-600 text-4xl" />,
      title: 'Create Company Profile',
      desc: 'Register your company and showcase your brand.',
    },
    {
      icon: <FaSearch className="text-green-600 text-4xl" />,
      title: 'Post Jobs',
      desc: 'List open positions and requirements easily.',
    },
    {
      icon: <FaUserTie className="text-green-600 text-4xl" />,
      title: 'Review Candidates',
      desc: 'Browse matched candidates and view their profiles.',
    },
    {
      icon: <FaComments className="text-green-600 text-4xl" />,
      title: 'Connect & Hire',
      desc: 'Message, interview, and hire the best talent.',
    },
  ];

  return (
    <div className="min-h-screen bg-green-50 flex flex-col font-sans">
      {/* Navbar placeholder */}
      {/* <div className="h-20" id="navbar-anchor" /> */}
      {/* Hero Section */}
      <section id="hero" className="relative w-full min-h-[calc(100vh-80px)] flex items-center justify-center mb-24 shadow-lg overflow-hidden">
        <motion.img
          src={heroImg}
          alt="Professional networking"
          className="absolute inset-0 w-full h-full object-cover object-center z-0"
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/60 to-green-700/70 z-10"
          variants={bgVariants}
          initial="hidden"
          animate="visible"
        />
        <motion.div
          className="relative z-20 flex flex-col items-center justify-center w-full text-center px-4"
          variants={heroVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.h1
            className="text-6xl md:text-7xl font-extrabold text-white mb-6 drop-shadow-lg tracking-tight"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 1, ease: 'easeOut' }}
          >
            Welcome to <span className="text-green-300">JobMatch</span>
          </motion.h1>
          <motion.p
            className="text-2xl md:text-3xl text-green-100 font-semibold mb-10 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: 'easeOut' }}
          >
            Connecting top talent with leading companies. Find your perfect match today.
          </motion.p>
          <motion.div
            className="flex gap-8 justify-center mt-2"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-4 px-12 rounded-xl text-2xl shadow-xl transition-transform duration-300"
              onClick={() => handleRegisterClick("job_seeker")}
              variants={itemVariants}
            >
              Get Started
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.97 }}
              className="bg-white hover:bg-green-100 text-green-700 font-extrabold py-4 px-12 rounded-xl text-2xl shadow-xl border border-green-500 transition-transform duration-300"
              onClick={() => handleRegisterClick("company")}
              variants={itemVariants}
            >
              Post a Job
            </motion.button>
          </motion.div>
        </motion.div>
      </section>

      {/* Features Timeline Section */}
      <motion.section
        id="features"
        className="w-full max-w-7xl mx-auto mb-24 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={1}
      >
        <h2 className="text-4xl font-extrabold text-green-800 mb-16 text-center">Why Choose JobMatch?</h2>
        <div className="relative flex flex-col md:flex-row items-center justify-between gap-16 md:gap-0">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className={`flex flex-col items-center md:w-1/4 w-full z-10 ${i % 2 === 1 ? 'md:mt-24' : ''}`}
              variants={itemVariants}
            >
              <div className="relative flex flex-col items-center">
                <div className="bg-white rounded-full shadow-xl p-4 mb-4 border-4 border-green-100">
                  {f.icon}
                </div>
                <img src={f.img} alt={f.title} className="w-28 h-28 object-cover rounded-xl mb-4 shadow-lg border-4 border-green-100" />
                <h3 className="text-xl font-extrabold text-green-700 mb-2 text-center">{f.title}</h3>
                <p className="text-gray-600 text-center text-lg mb-2">{f.desc}</p>
              </div>
            </motion.div>
          ))}
          {/* Timeline line */}
          <div className="hidden md:block absolute top-1/2 left-0 right-0 h-2 bg-gradient-to-r from-green-200 via-green-400 to-green-200 z-0" style={{ transform: 'translateY(-50%)' }} />
        </div>
      </motion.section>

      {/* How It Works - two columns for Job Seekers and Companies */}
      <motion.section
        id="how-it-works"
        className="w-full max-w-7xl mx-auto mb-24 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={4}
      >
        <h2 className="text-4xl font-extrabold text-green-800 mb-16 text-center">How It Works</h2>
        <div className="flex flex-col md:flex-row gap-16 md:gap-32 items-start justify-center">
          {/* Job Seekers */}
          <div className="flex-1">
            <h3 className="text-2xl font-extrabold text-green-700 mb-8 text-center md:text-left">For Job Seekers</h3>
            <div className="relative flex flex-col gap-12">
              {seekerSteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  className="flex items-center gap-6 z-10"
                  variants={itemVariants}
                >
                  <div className="bg-white rounded-full shadow-xl p-4 border-4 border-green-100 flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-green-700 mb-1">Step {i + 1}: {step.title}</div>
                    <div className="text-gray-600 text-lg">{step.desc}</div>
                  </div>
                </motion.div>
              ))}
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-200 via-green-400 to-green-200 z-0" style={{ marginLeft: '-0.25rem' }} />
            </div>
          </div>
          {/* Companies */}
          <div className="flex-1">
            <h3 className="text-2xl font-extrabold text-green-700 mb-8 text-center md:text-left">For Companies</h3>
            <div className="relative flex flex-col gap-12">
              {companySteps.map((step, i) => (
                <motion.div
                  key={step.title}
                  className="flex items-center gap-6 z-10"
                  variants={itemVariants}
                >
                  <div className="bg-white rounded-full shadow-xl p-4 border-4 border-green-100 flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <div className="text-2xl font-extrabold text-green-700 mb-1">Step {i + 1}: {step.title}</div>
                    <div className="text-gray-600 text-lg">{step.desc}</div>
                  </div>
                </motion.div>
              ))}
              {/* Vertical line */}
              <div className="absolute left-6 top-0 bottom-0 w-1 bg-gradient-to-b from-green-200 via-green-400 to-green-200 z-0" style={{ marginLeft: '-0.25rem' }} />
            </div>
          </div>
        </div>
      </motion.section>

      {/* Testimonials - carousel with speech bubble style */}
      <motion.section
        id="testimonials"
        className="w-full max-w-4xl mx-auto mb-24 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={5}
      >
        <h2 className="text-4xl font-extrabold text-green-800 mb-12 text-center">What Our Users Say</h2>
        <div className="flex flex-col items-center">
          <div className="relative w-full flex flex-col items-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={testimonialIdx}
                className="relative bg-white rounded-3xl shadow-2xl px-8 py-12 max-w-2xl mx-auto mb-8 border-l-8 border-green-400 before:content-[''] before:absolute before:-bottom-6 before:left-16 before:w-0 before:h-0 before:border-t-8 before:border-t-green-400 before:border-l-8 before:border-l-transparent before:border-r-8 before:border-r-transparent"
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -40 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
              >
                <div className="flex items-center gap-4 mb-4">
                  <img src={testimonials[testimonialIdx].img} alt={testimonials[testimonialIdx].name} className="w-16 h-16 object-cover rounded-full shadow-lg border-4 border-green-100" />
                  <div>
                    <div className="font-extrabold text-green-700 text-lg">{testimonials[testimonialIdx].name}</div>
                    <div className="text-md text-gray-500">{testimonials[testimonialIdx].role}</div>
                  </div>
                </div>
                <p className="text-gray-700 italic text-lg">"{testimonials[testimonialIdx].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-4 justify-center">
              {testimonials.map((_, idx) => (
          <button 
                  key={idx}
                  className={`w-3 h-3 rounded-full ${testimonialIdx === idx ? 'bg-green-600' : 'bg-green-200'} transition-colors`}
                  onClick={() => setTestimonialIdx(idx)}
                  aria-label={`Go to testimonial ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.section>

      {/* Stats Section - row, no boxes */}
      <motion.section
        id="stats"
        className="w-full max-w-7xl mx-auto mb-24 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={2}
      >
        <div className="rounded-3xl bg-gradient-to-r from-green-100 via-green-50 to-green-100 py-16 px-4 flex flex-col md:flex-row items-center justify-between gap-12 md:gap-0">
          {stats.map((s, idx) => (
            <motion.div
              key={s.label}
              className="flex flex-col items-center flex-1"
              variants={itemVariants}
            >
              {s.icon}
              <div className="text-5xl font-extrabold text-green-700 mt-4 mb-2">{s.value}</div>
              <div className="text-xl text-gray-700 font-semibold">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </motion.section>

      {/* About/Mission Section - split layout with image */}
      <motion.section
        id="about"
        className="w-full max-w-7xl mx-auto mb-24 px-4"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        custom={3}
      >
        <div className="flex flex-col md:flex-row items-center gap-12">
          <img src={aboutImg} alt="About JobMatch" className="w-full md:w-1/2 rounded-3xl shadow-2xl object-cover" />
          <div className="flex-1">
            <h2 className="text-4xl font-extrabold text-green-800 mb-8 text-center md:text-left">Our Mission</h2>
            <p className="text-2xl text-gray-700 text-center md:text-left max-w-3xl mx-auto md:mx-0">
              At <span className="font-extrabold text-green-700">JobMatch</span>, our mission is to bridge the gap between talent and opportunity. We believe in empowering individuals to find meaningful work and helping companies build exceptional teams. Our platform is designed to make the job search and hiring process efficient, transparent, and rewarding for everyone.
            </p>
          </div>
      </div>
      </motion.section>
    </div>
  );
};

export default Home; 