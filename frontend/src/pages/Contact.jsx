import React from 'react';
import { motion } from 'framer-motion';
import heroImg from '../assets/5.jpg';
import { FaUser, FaEnvelope, FaCommentDots, FaMapMarkerAlt } from 'react-icons/fa';

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

const Contact = () => (
  <div className="min-h-screen bg-green-50 font-sans flex flex-col items-center">
    {/* Hero Section */}
    <section className="relative w-full min-h-[320px] flex items-center justify-center mb-16 shadow-lg overflow-hidden">
      <img src={heroImg} alt="Contact JobMatch" className="absolute inset-0 w-full h-full object-cover object-center z-0" />
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-green-800/60 to-green-700/70 z-10" />
      <div className="relative z-20 flex flex-col items-center justify-center w-full text-center px-4">
        <h1 className="text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg tracking-tight">Contact <span className="text-green-300">JobMatch</span></h1>
        <p className="text-xl md:text-2xl text-green-100 font-semibold mb-2 max-w-2xl mx-auto">We'd love to hear from you!</p>
      </div>
    </section>

    <motion.section
      className="w-full max-w-4xl mx-auto mb-20 px-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={1}
    >
      <div className="flex flex-col md:flex-row gap-12">
        {/* Contact Form */}
        <motion.form
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 flex-1 flex flex-col gap-6"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-2">
            <FaUser className="text-green-600 text-xl" />
            <input className="w-full bg-transparent outline-none text-lg" id="name" type="text" placeholder="Your Name" />
          </div>
          <div className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-2">
            <FaEnvelope className="text-green-600 text-xl" />
            <input className="w-full bg-transparent outline-none text-lg" id="email" type="email" placeholder="you@email.com" />
          </div>
          <div className="flex items-center gap-3 bg-green-50 rounded-lg px-4 py-2">
            <FaCommentDots className="text-green-600 text-xl" />
            <textarea className="w-full bg-transparent outline-none text-lg" id="message" rows="5" placeholder="Type your message here..." />
          </div>
          <button type="submit" className="bg-green-500 hover:bg-green-600 text-white font-extrabold py-3 px-8 rounded-lg shadow-lg transition-colors duration-300 w-full">Send Message</button>
        </motion.form>
        {/* Contact Info */}
        <motion.div
          className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-10 flex-1 flex flex-col gap-6 items-center justify-center text-center"
          variants={itemVariants}
        >
          <div className="flex items-center gap-3 text-green-700 text-lg font-bold">
            <FaEnvelope /> support@jobmatch.com
          </div>
          <div className="flex items-center gap-3 text-green-700 text-lg font-bold">
            <FaMapMarkerAlt /> 123 Main Street, City, Country
          </div>
        </motion.div>
      </div>
    </motion.section>
  </div>
);

export default Contact; 