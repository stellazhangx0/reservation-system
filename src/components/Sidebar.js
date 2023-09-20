import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Sidebar.css';

function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="sidebar">
      <div className="sidebar-item">
        <h2><Link to="/">Nowheregirl Studio</Link></h2>
      </div>
      <div className="sidebar-item">
        <span>Portfolio</span>
        <ul className="sidebar-submenu">
          <li><Link to="/portfolio/portrait">Portrait</Link></li>
          <li><Link to="/portfolio/yearbook">Yearbook</Link></li>
          <li><Link to="/portfolio/linkedin-photo">LinkedIn Photo</Link></li>
        </ul>
      </div>
      <div className="sidebar-item">
        <Link to="/reservation">Reservation</Link>
      </div>
      <div className="sidebar-item">
        <Link to="/about">About</Link>
      </div>
    </div>
  );
};

export default Sidebar;
