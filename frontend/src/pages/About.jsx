import React from 'react';
import { motion } from 'framer-motion';
import heroImg from '../assets/2.jpg';
import team1 from '../assets/7.jpg';
import team2 from '../assets/8.jpg';
import team3 from '../assets/9.jpg';
import timelineImg from '../assets/10.jpg';
import impactImg from '../assets/11.jpg';
import { FaHandshake, FaLightbulb, FaUsers, FaShieldAlt, FaLinkedin, FaFlagCheckered, FaChartLine, FaAward } from 'react-icons/fa';

const team = [
  { name: 'Jane Doe', role: 'CEO & Founder', img: team1, bio: 'Visionary leader with a passion for connecting people and opportunities.', linkedin: '#' },
  { name: 'John Smith', role: 'CTO', img: team2, bio: 'Tech enthusiast focused on building seamless digital experiences.', linkedin: '#' },
  { name: 'Emily Lee', role: 'Head of Operations', img: team3, bio: 'Ensuring everything runs smoothly for our users and partners.', linkedin: '#' },
];

const values = [
  { icon: <FaShieldAlt className="text-green-700 text-2xl" />, label: 'Integrity', desc: 'Honesty and transparency in all we do.' },
  { icon: <FaLightbulb className="text-green-700 text-2xl" />, label: 'Innovation', desc: 'Embracing new ideas for better hiring.' },
  { icon: <FaUsers className="text-green-700 text-2xl" />, label: 'Empowerment', desc: 'Helping people and companies reach their potential.' },
  { icon: <FaHandshake className="text-green-700 text-2xl" />, label: 'Community', desc: 'A supportive, inclusive environment for all.' },
];

const timeline = [
  { year: '2022', icon: <FaFlagCheckered className="text-green-700 text-xl" />, title: 'Founded', desc: 'JobMatch is founded with a mission to connect talent and opportunity.', img: timelineImg },
  { year: '2023', icon: <FaChartLine className="text-green-700 text-xl" />, title: 'First 100 Hires', desc: 'We celebrate our first 100 successful job placements.', img: timelineImg },
  { year: '2024', icon: <FaAward className="text-green-700 text-xl" />, title: 'Major Partnerships', desc: 'Partnered with leading companies to expand our reach.', img: timelineImg },
];

const impactStats = [
  { icon: <FaUsers className="text-green-700 text-3xl" />, label: 'Users', value: '10,000+' },
  { icon: <FaHandshake className="text-green-700 text-3xl" />, label: 'Matches', value: '2,000+' },
  { icon: <FaChartLine className="text-green-700 text-3xl" />, label: 'Companies', value: '500+' },
];

const containerVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: (i = 1) => ({
    opacity: 1,
    y: 0,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.1 * i,
      duration: 0.7,
      ease: 'easeOut',
    },
  }),
};
const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const About = () => (
  <div className="min-h-screen bg-gray-50 font-sans flex flex-col items-center">
    {/* Hero Section */}
    <section className="relative w-full min-h-[280px] flex items-center justify-center mb-12 bg-gradient-to-r from-green-100 via-white to-green-100 overflow-hidden">
      <img src={heroImg} alt="About JobMatch" className="absolute inset-0 w-full h-full object-cover object-center z-0 opacity-20 animate-pulse" />
      <div className="relative z-10 flex flex-col items-center justify-center w-full text-center px-4 py-14">
        <h1 className="text-5xl md:text-6xl font-extrabold text-green-800 mb-2 tracking-tight">About <span className="text-green-600">JobMatch</span></h1>
        <p className="text-xl md:text-2xl text-gray-700 font-medium mb-2 max-w-2xl mx-auto">Empowering connections between talent and opportunity.</p>
        <div className="text-md text-green-700 font-semibold mb-2">Building bridges for a better workforce, every day.</div>
      </div>
    </section>

    {/* Mission Section */}
    <motion.section
      className="w-full max-w-6xl mx-auto mb-16 px-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={1}
    >
      <div className="flex flex-col md:flex-row items-center bg-white rounded-2xl shadow p-8 gap-10">
        <img src={heroImg} alt="Mission" className="w-full md:w-1/2 rounded-xl object-cover shadow-md" />
        <div className="flex-1">
          <h2 className="text-3xl font-extrabold text-green-800 mb-4">Our Mission</h2>
          <p className="text-lg text-gray-700 mb-2">
            At <span className="font-extrabold text-green-700">JobMatch</span>, our mission is to bridge the gap between talent and opportunity. We empower individuals to find meaningful work and help companies build exceptional teams. Our platform is designed to make the job search and hiring process efficient, transparent, and rewarding for everyone.
          </p>
        </div>
      </div>
      {/* What We Do Timeline */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">What We Do</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8">
          {timeline.map((item, i) => (
            <motion.div
              key={item.title}
              className="flex flex-col items-center text-center gap-2 flex-1"
              variants={itemVariants}
            >
              <div className="flex items-center gap-2 mb-2">
                {item.icon}
                <span className="text-green-700 font-bold text-lg">{item.year}</span>
              </div>
              <img src={item.img} alt={item.title} className="w-20 h-20 object-cover rounded-xl shadow mb-2" />
              <div className="font-bold text-green-800 text-lg">{item.title}</div>
              <div className="text-gray-600 text-sm max-w-xs">{item.desc}</div>
            </motion.div>
          ))}
        </div>
      </div>
      {/* Our Impact Stats */}
      <div className="mt-12">
        <h3 className="text-2xl font-bold text-green-700 mb-6 text-center">Our Impact</h3>
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 bg-gradient-to-r from-green-50 via-white to-green-50 rounded-xl py-8 px-4">
          {impactStats.map((stat, i) => (
            <motion.div
              key={stat.label}
              className="flex flex-col items-center text-center gap-2 flex-1"
              variants={itemVariants}
            >
              {stat.icon}
              <div className="text-3xl font-extrabold text-green-800 mt-2">{stat.value}</div>
              <div className="text-gray-700 text-md font-semibold">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>

    {/* Divider */}
    <div className="w-full max-w-6xl mx-auto border-t border-green-100 my-12" />

    {/* Team Section */}
    <motion.section
      className="w-full max-w-6xl mx-auto mb-16 px-4"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={2}
    >
      <h2 className="text-3xl font-extrabold text-green-800 mb-8 text-center">Our Team</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {team.map((member, i) => (
          <motion.div
            key={member.name}
            className="bg-white rounded-xl shadow p-8 flex flex-col items-center"
            variants={itemVariants}
            whileHover={{ scale: 1.03 }}
          >
            <img src={member.img} alt={member.name} className="w-24 h-24 object-cover rounded-full mb-4 shadow border-4 border-green-100" />
            <div className="font-bold text-green-800 text-lg mb-1">{member.name}</div>
            <div className="text-sm text-gray-500 mb-2">{member.role}</div>
            <div className="text-gray-600 text-sm mb-2 text-center">{member.bio}</div>
            <a href={member.linkedin} target="_blank" rel="noopener noreferrer" className="text-green-700 hover:text-green-900 mt-2"><FaLinkedin className="text-2xl" /></a>
          </motion.div>
        ))}
      </div>
    </motion.section>

    {/* Divider */}
    <div className="w-full max-w-6xl mx-auto border-t border-green-100 my-12" />

    {/* Values Section */}
    <motion.section
      className="w-full max-w-6xl mx-auto mb-20 px-4 bg-gradient-to-r from-green-50 via-white to-green-50 rounded-xl py-10"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      custom={3}
    >
      <h2 className="text-3xl font-extrabold text-green-800 mb-4 text-center">Our Values</h2>
      <div className="text-center text-gray-700 mb-8">We are guided by principles that shape our culture and drive our mission forward.</div>
      <div className="flex flex-col md:flex-row items-center justify-between gap-8">
        {values.map((v, i) => (
          <motion.div
            key={v.label}
            className="flex flex-col items-center text-center gap-2"
            variants={itemVariants}
          >
            {v.icon}
            <div className="font-bold text-green-800 mt-2 mb-1">{v.label}</div>
            <div className="text-gray-600 text-sm max-w-xs">{v.desc}</div>
          </motion.div>
        ))}
      </div>
    </motion.section>
  </div>
);

export default About; 