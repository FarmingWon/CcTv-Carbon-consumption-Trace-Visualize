// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Header.css';

function Header() {
  return (
    <div className="header-component">
      <div className="header-box">
        <div className="head">
          <img src="./logo.png" alt="Logo" width="100px" height="100px" className="logoimg"></img>
          <h2 className="title">CcTv-Carbon-consumption-Trace-Visualize</h2>
        </div>
        <header className="head-link">
          <Link to="/">Home</Link> | <Link to="/about">About</Link> |{' '}
          <Link to="/Counter">Counter</Link> | <Link to="/Input">Input</Link> |{' '}
          <Link to="/List">List</Link> | <Link to="/Train">Train</Link> | <Link to="/map">map</Link>{' '}
          | <Link to="/Intensity">Intensity</Link>
        </header>
      </div>
    </div>
  );
}

export default Header;
