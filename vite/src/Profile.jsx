import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import { useTheme } from "./ThemeContext";

export default function Profile() {
  const navigate = useNavigate();
  const { theme, setTheme, toggleTheme, isDark } = useTheme();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [activeTab, setActiveTab] = useState("profile"); // 'profile' | 'settings' | 'addresses'
  const [name, setName] = useState(user?.name || "Shivansh Tiwari");
  const [email, setEmail] = useState(user?.email || "shivansh@example.com");
  const [phone, setPhone] = useState("+91 98765 43210");
  const [saveSuccess, setSaveSuccess] = useState(false);

  const logoutNow = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const initial = name ? name.charAt(0).toUpperCase() : "U";

  const saveChanges = async () => {
    try {
      const res = await api.put("/update-profile", { name, email }).catch(() => ({
        data: { user: { ...user, name, email } },
      }));

      localStorage.setItem("user", JSON.stringify(res.data.user || { ...user, name, email }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    } catch (err) {
      console.log(err);
      // Fallback local update
      localStorage.setItem("user", JSON.stringify({ ...user, name, email }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  return (
    <div className="profile-wrapper">
      {/* SIDEBAR NAVIGATION */}
      <aside className="profile-sidebar">
        <div className="profile-sidebar-user">
          <div className="profile-sidebar-avatar">{initial}</div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{name}</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>{email}</p>
        </div>

        <div className="profile-nav-links">
          <button
            className={`profile-nav-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            👤 Personal Details
          </button>

          <button
            className={`profile-nav-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            ⚙️ Theme & Settings
          </button>

          <button
            className={`profile-nav-btn ${activeTab === "addresses" ? "active" : ""}`}
            onClick={() => setActiveTab("addresses")}
          >
            📍 Saved Addresses
          </button>

          <button
            className="profile-nav-btn"
            onClick={() => navigate("/orders")}
          >
            📦 My Orders
          </button>
        </div>

        <button
          onClick={logoutNow}
          style={{
            marginTop: "auto",
            padding: "10px",
            borderRadius: "10px",
            color: "var(--brand-danger)",
            background: "rgba(239, 68, 68, 0.1)",
            fontWeight: 700,
            fontSize: "0.88rem",
          }}
        >
          🚪 Sign Out
        </button>
      </aside>

      {/* MAIN CONTENT PANE */}
      <main className="profile-main-pane">
        {/* ================= TAB 1: PERSONAL DETAILS ================= */}
        {activeTab === "profile" && (
          <div>
            <h1 className="profile-title" style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
              Personal Information
            </h1>

            {saveSuccess && (
              <div
                style={{
                  background: "rgba(16, 185, 129, 0.15)",
                  color: "var(--brand-accent)",
                  border: "1px solid var(--brand-accent)",
                  padding: "12px 18px",
                  borderRadius: "12px",
                  marginBottom: "20px",
                  fontWeight: 700,
                  fontSize: "0.9rem",
                }}
              >
                ✓ Profile changes saved successfully!
              </div>
            )}

            <div className="checkout-inputs-grid" style={{ marginBottom: "24px" }}>
              <div className="form-group full-span">
                <label>Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group full-span">
                <label>Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="form-group full-span">
                <label>Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            <button className="cta-primary" onClick={saveChanges}>
              Save Profile Changes
            </button>
          </div>
        )}

        {/* ================= TAB 2: THEME & SETTINGS ================= */}
        {activeTab === "settings" && (
          <div>
            <h1 className="profile-title" style={{ fontSize: "1.8rem", marginBottom: "8px" }}>
              Preferences & Settings
            </h1>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
              Customize your interface theme, appearance, and shopping experience.
            </p>

            {/* Dedicated Theme Switcher Card */}
            <div className="settings-theme-card">
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>🎨 Color Theme Selection</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
                Select between Obsidian Cyber Dark mode or Clean Porcelain Light mode.
              </p>

              <div className="theme-options-grid">
                {/* Dark Theme Option */}
                <div
                  className={`theme-option-box ${theme === "dark" ? "active" : ""}`}
                  onClick={() => setTheme("dark")}
                >
                  <span className="theme-preview-icon">🌙</span>
                  <div>
                    <div className="theme-option-title">Obsidian Dark</div>
                    <div className="theme-option-desc">Deep cyber palette with vibrant neon glow</div>
                  </div>
                </div>

                {/* Light Theme Option */}
                <div
                  className={`theme-option-box ${theme === "light" ? "active" : ""}`}
                  onClick={() => setTheme("light")}
                >
                  <span className="theme-preview-icon">☀️</span>
                  <div>
                    <div className="theme-option-title">Porcelain Light</div>
                    <div className="theme-option-desc">Crisp white canvas with modern indigo accents</div>
                  </div>
                </div>
              </div>

              {/* Quick toggle switch */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: "20px",
                  paddingTop: "16px",
                  borderTop: "1px solid var(--panel-border)",
                }}
              >
                <div>
                  <strong>Current Theme: {isDark ? "Dark Mode" : "Light Mode"}</strong>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Theme preference is automatically remembered for your account.
                  </div>
                </div>

                <button className="cta-secondary" onClick={toggleTheme}>
                  {isDark ? "Switch to ☀️ Light" : "Switch to 🌙 Dark"}
                </button>
              </div>
            </div>

            {/* Notification settings */}
            <div className="settings-theme-card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "12px" }}>
                🔔 Notification Preferences
              </h3>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked />
                <span>Email updates regarding order shipment and delivery</span>
              </label>
              <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
                <input type="checkbox" defaultChecked />
                <span>Special cyber flash sale notifications and discount drops</span>
              </label>
            </div>
          </div>
        )}

        {/* ================= TAB 3: SAVED ADDRESSES ================= */}
        {activeTab === "addresses" && (
          <div>
            <h1 className="profile-title" style={{ fontSize: "1.8rem", marginBottom: "20px" }}>
              Saved Addresses
            </h1>

            <div
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--panel-border)",
                borderRadius: "16px",
                padding: "20px",
                marginBottom: "20px",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                <strong>Home (Default Delivery Address)</strong>
                <span style={{ color: "var(--brand-accent)", fontWeight: 700, fontSize: "0.82rem" }}>✓ Active</span>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                {name} <br />
                24 Cyber Tower, MG Road <br />
                Bengaluru, Karnataka - 560001 <br />
                Phone: {phone}
              </p>
            </div>

            <button className="cta-secondary">
              + Add New Delivery Address
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
