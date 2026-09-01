import React from "react";
import { Link } from "react-router-dom";
import { ShieldIcon, TruckIcon } from "./components/Icons";

export default function Footer() {
  return (
    <footer className="neo-footer">
      <div className="neo-footer-container">
        {/* Back To Top */}
        <div
          className="neo-footer-top-btn"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        >
          Back to Top of Page
        </div>

        {/* Footer Link Columns */}
        <div className="neo-footer-grid">
          {/* Column 1 */}
          <div className="footer-col">
            <h4>Get to Know Us</h4>
            <ul>
              <li><Link to="/info/about">About OS Store</Link></li>
              <li><Link to="/info/careers">Careers & Openings</Link></li>
              <li><Link to="/info/press">Press & Announcements</Link></li>
              <li><Link to="/info/devices">OS Hardware Devices</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="footer-col">
            <h4>Merchant & Partners</h4>
            <ul>
              <li><Link to="/info/sell">Sell on OS Marketplace</Link></li>
              <li><Link to="/info/affiliate">Creator Affiliate Program</Link></li>
              <li><Link to="/info/advertise">Advertise Your Products</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h4>Customer Care</h4>
            <ul>
              <li><Link to="/info/help">Help Center & FAQ</Link></li>
              <li><Link to="/info/returns">Returns & Replacement Portal</Link></li>
              <li><Link to="/orders">Track Your Orders</Link></li>
              <li><Link to="/profile">Account Settings</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="footer-col">
            <h4>Security & Support</h4>
            <ul>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--brand-accent)" }}>
                <ShieldIcon size={16} />
                <span>256-Bit SSL Secured</span>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--brand-primary)" }}>
                <TruckIcon size={16} />
                <span>Same-Day Dispatch</span>
              </li>
              <li style={{ color: "var(--text-muted)" }}>Bengaluru, Karnataka, India</li>
              <li style={{ color: "var(--text-muted)" }}>support@osstore.io</li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="neo-footer-bottom">
          <div>© {new Date().getFullYear()} OS Store. All Rights Reserved.</div>
          <div style={{ display: "flex", gap: "16px" }}>
            <span>Verified Authentic Inventory</span>
            <span>•</span>
            <span>All Prices Inclusive of GST</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
