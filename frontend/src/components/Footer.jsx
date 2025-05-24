import React from 'react';
import './Footer.css';
import { Link } from 'react-router-dom';


function Footer({ fixed }) {
  return (
    <footer className={`footer ${fixed ? 'fixed-footer' : 'relative-footer'}`}>
      <div className="footer-content">
        <div className="footer-left">© 2025 coStream</div>
        <div className="footer-right">
          <Link to="/">Terms</Link>
          <Link to="/">Privacy</Link>
          <Link to="/">Contact</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;




