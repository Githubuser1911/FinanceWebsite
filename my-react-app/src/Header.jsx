import React from 'react';
import pensulogo from './assets/pensulogo.PNG'; // Logo image
import 'bootstrap/dist/css/bootstrap.min.css';

function Header() {
  return (
    <nav
      className="banner"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px 20px',
        backgroundColor: '#f8f9fa', // Light background color for the nav bar
        borderBottom: '1px solid #ddd',
      }}
    >
      {/* Left - Logo and Title */}
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <img
          src={pensulogo}
          alt="Logo"
          style={{
            height: '50px',
            marginRight: '10px',
            backgroundColor: 'transparent', // Ensure no background around the image
            display: 'block', // Remove any extra spacing or margin caused by inline-block
            border: 'none', // Ensure no border
          }}
        />
        <h1 style={{ margin: 0, fontSize: '1.8rem', color: '#333' }}>
          Pensu Financials
        </h1>
      </div>

      {/* Right - Navigation Links */}
      <ul
        className="nav"
        style={{
          display: 'flex',
          gap: '20px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
        }}
      >
        <li>
          <a
            href="/"
            className="link"
            style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}
          >
            Home
          </a>
        </li>

        {/* About Dropdown */}
        <li className="dropdown">
          <a
            href="#"
            className="link dropdown-toggle"
            style={{
              textDecoration: 'none',
              color: '#333',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            About
          </a>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" href="/team">
                Our Team
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="/mission">
                Our Mission
              </a>
            </li>
          </ul>
        </li>

        {/* Services Dropdown */}
        <li className="dropdown">
          <a
            href="#"
            className="link dropdown-toggle"
            style={{
              textDecoration: 'none',
              color: '#333',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            data-bs-toggle="dropdown"
            aria-expanded="false"
          >
            Services
          </a>
          <ul className="dropdown-menu">
            <li>
              <a className="dropdown-item" href="/personal-finance">
                Personal Finance
              </a>
            </li>
            <li>
              <a className="dropdown-item" href="/financial-tools">
                Financial Tools
              </a>
            </li>
          </ul>
        </li>

        <li>
          <a
            href="/contact"
            className="link"
            style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}
          >
            Contact
          </a>
        </li>
        <li>
          <a
            href="/login"
            className="link"
            style={{ textDecoration: 'none', color: '#333', fontWeight: 'bold' }}
          >
            Login
          </a>
        </li>
      </ul>
    </nav>
  );
}

export default Header;
