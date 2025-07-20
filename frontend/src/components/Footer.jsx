import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const containerVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: 'easeOut' } },
};

const Footer = () => {
  return (
    <motion.footer
      className="bg-green-900 text-green-100 py-12 px-4 mt-auto w-full"
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
        <div className="text-2xl font-extrabold tracking-wide">JobMatch</div>
        <div className="flex gap-10 text-lg font-semibold">
          <Link to="/about" className="hover:underline">About</Link>
          <Link to="/contact" className="hover:underline">Contact</Link>
          <Link to="/privacy" className="hover:underline">Privacy Policy</Link>
        </div>
        <div className="text-md">&copy; 2025 JobMatch. All rights reserved.</div>
      </div>
    </motion.footer>
  );
};

export default Footer;