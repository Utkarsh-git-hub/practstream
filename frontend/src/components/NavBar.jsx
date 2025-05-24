import React from 'react';
import { Link } from 'react-router-dom';
import './NavBar.css';
import logo from '../images/logo.png';

function NavBar() {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">
          <img src={logo} alt="Logo" className="logo-image" />
        </Link>
      </div>
      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/create">Create Room</Link>
        <Link to="/join">Join Room</Link>
        {/* <Link to="/about">About</Link> */}
      </div>
    </nav>
  );
}

export default NavBar;

