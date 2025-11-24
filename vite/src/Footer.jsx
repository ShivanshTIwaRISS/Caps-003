import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="neo-footer">

      {/* Back to Top */}
      <div
        className="neo-footer-top"
        onClick={() =>
          window.scrollTo({ top: 0, behavior: "smooth" })
        }
      >
        ↑ Back to Top
      </div>

      {/* Link Sections */}
      <div className="neo-footer-links">

        <div className="footer-col">
          <h4>Get to Know Us</h4>
          <ul>
            <li><Link to="/info/about">About OS</Link></li>
            <li><Link to="/info/careers">Careers</Link></li>
            <li><Link to="/info/press">Press Releases</Link></li>
            <li><Link to="/info/devices">OS Devices</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Connect with Us</h4>
          <ul>
            <li>
              <a href="https://facebook.com" target="_blank">Facebook</a>
            </li>
            <li>
              <a href="https://twitter.com" target="_blank">Twitter</a>
            </li>
            <li>
              <a href="https://instagram.com" target="_blank">Instagram</a>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Make Money with Us</h4>
          <ul>
            <li><Link to="/info/sell">Sell on OS</Link></li>
            <li><Link to="/info/affiliate">Affiliate Program</Link></li>
            <li><Link to="/info/advertise">Advertise Your Products</Link></li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Let Us Help You</h4>
          <ul>
            <li><Link to="/info/account">Your Account</Link></li>
            <li><Link to="/info/returns">Returns Centre</Link></li>
            <li><Link to="/info/help">Help</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom Branding */}
      <div className="neo-footer-bottom">
        © {new Date().getFullYear()} OS Store — Crafted with ♥ Next-Gen UI
      </div>
    </footer>
  );
}
