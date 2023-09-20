import React from 'react';
import './Footer.css';
import instagramIcon from './instagram-icon.png'; 

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div style={{ display: 'flex', alignItems: 'center' }}>  {/* New wrapper div */}
          <p>&copy; 2023 Nowheregirl Studio</p>
          <a href="https://www.instagram.com/nowheregirl.x" target="_blank" rel="noreferrer">
            <img src={instagramIcon} alt="Instagram" className="social-icon" />
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
