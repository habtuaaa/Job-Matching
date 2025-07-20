import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  // Helper for anchor links
  const handleAnchorClick = (e, id) => {
    if (location.pathname === '/') {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({ top: el.offsetTop - 70, behavior: 'smooth' });
      }
    }
  };

  return (
    <nav className="sticky top-0 left-0 w-full bg-white shadow z-50 font-sans">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="text-2xl font-extrabold text-green-700 tracking-tight">JobMatch</Link>
        <div className="flex gap-6 text-md font-bold">
          <Link to="/" className="hover:text-green-600" onClick={e => handleAnchorClick(e, 'hero')}>Home</Link>
          <Link to="/about" className="hover:text-green-600">About</Link>
          <Link to="/contact" className="hover:text-green-600">Contact</Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 