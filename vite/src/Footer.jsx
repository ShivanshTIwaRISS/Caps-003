import React from "react";
import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="neo-footer">
      <div className="neo-footer-container">
        {/* Back To Top */}
        <div
          className="neo-footer-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          ↑ Back to Top of Page
        </div>

        {/* Footer Link Columns */}
        <div className="neo-footer-grid">
          {/* Column 1 */}
          <div className="footer-col">
            <h4>Get to Know Us</h4>
            <ul>
              <li><Link to="/info/about">About OS Store</Link></li>
              <li><Link to="/info/careers">Careers & Openings</Link></li>
              <li><Link to="/info/press">Press & Media</Link></li>
              <li><Link to="/info/devices">OS Cyber Devices</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="footer-col">
            <h4>Make Money with Us</h4>
            <ul>
              <li><Link to="/info/sell">Sell on OS Marketplace</Link></li>
              <li><Link to="/info/affiliate">Creator Affiliate Program</Link></li>
              <li><Link to="/info/advertise">Advertise Your Products</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h4>Customer Care & Policies</h4>
            <ul>
              <li><Link to="/info/help">Help Center & FAQs</Link></li>
              <li><Link to="/info/returns">Returns & Replacement</Link></li>
              <li><Link to="/orders">Track Your Orders</Link></li>
              <li><Link to="/profile">Account Settings</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="footer-col">
            <h4>Connect & Security</h4>
            <ul>
              <li><span style={{ color: "var(--brand-accent)" }}>🔒 256-Bit SSL Encryption</span></li>
              <li><span style={{ color: "var(--brand-primary)" }}>🚀 Same-Day Dispatch</span></li>
              <li><span style={{ color: "var(--text-muted)" }}>📍 Bengaluru, India</span></li>
              <li><span style={{ color: "var(--text-muted)" }}>✉️ support@osstore.io</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom Branding */}
        <div className="neo-footer-bottom">
          <div>© {new Date().getFullYear()} OS Store. All Rights Reserved.</div>
          <div style={{ display: "flex", gap: "16px" }}>
            <span>Powered by React 19 & Vite</span>
            <span>•</span>
            <span>100% Genuine Certified Gear</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
