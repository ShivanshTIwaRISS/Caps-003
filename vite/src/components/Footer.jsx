import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="footer">
      {/* BACK TO TOP */}
      <div className="backToTop" onClick={() => window.scrollTo(0, 0)}>
        Back to top
      </div>

      {/* LINK SECTIONS */}
      <div className="linkSection">
        <div>
          <h4>Get to Know Us</h4>
          <ul>
            <li><Link to="/info/about">About OS</Link></li>
            <li><Link to="/info/careers">Careers</Link></li>
            <li><Link to="/info/press">Press Releases</Link></li>
            <li><Link to="/info/devices">OS Devices</Link></li>
          </ul>
        </div>

        <div>
          <h4>Connect with Us</h4>
          <ul>
            <li><a href="https://facebook.com" target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a href="https://twitter.com" target="_blank" rel="noopener noreferrer">Twitter</a></li>
            <li><a href="https://instagram.com" target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>

        <div>
          <h4>Make Money with Us</h4>
          <ul>
            <li><Link to="/info/sell">Sell on OS</Link></li>
            <li><Link to="/info/affiliate">Affiliate Program</Link></li>
            <li><Link to="/info/advertise">Advertise Your Products</Link></li>
          </ul>
        </div>

        <div>
          <h4>Let Us Help You</h4>
          <ul>
            <li><Link to="/info/account">Your Account</Link></li>
            <li><Link to="/info/returns">Returns Centre</Link></li>
            <li><Link to="/info/help">Help</Link></li>
          </ul>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="bottomBar">
        <p>© {new Date().getFullYear()} OS Store. All rights reserved.</p>
      </div>
    </footer>
  );
}
