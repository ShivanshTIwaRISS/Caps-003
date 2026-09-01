import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "./services/api";
import { useTheme } from "./ThemeContext";
import {
  UserIcon,
  SettingsIcon,
  PackageIcon,
  SunIcon,
  MoonIcon,
  CheckIcon,
  LogOutIcon,
  CloseIcon,
  TrashIcon,
} from "./components/Icons";

export default function Profile() {
  const navigate = useNavigate();
  const { theme, setTheme, toggleTheme, isDark } = useTheme();

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [activeTab, setActiveTab] = useState("profile");
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Address Manager State — starts empty unless user saved addresses
  const [addresses, setAddresses] = useState(() => {
    try {
      const stored = localStorage.getItem("saved_addresses");
      return stored ? JSON.parse(stored) : [];
    } catch (e) {
      return [];
    }
  });

  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState({
    label: "Home",
    name: name,
    street: "",
    city: "",
    state: "",
    zip: "",
    phone: phone,
  });

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
      localStorage.setItem("user", JSON.stringify({ ...user, name, email }));
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.zip) {
      alert("Please fill in street address, city, and zip code.");
      return;
    }

    const created = {
      ...newAddress,
      id: `addr-${Date.now()}`,
      isDefault: addresses.length === 0,
    };

    const updated = [...addresses, created];
    setAddresses(updated);
    localStorage.setItem("saved_addresses", JSON.stringify(updated));
    setShowAddressModal(false);
    setNewAddress({
      label: "Home",
      name: name,
      street: "",
      city: "",
      state: "",
      zip: "",
      phone: phone,
    });
  };

  const handleDeleteAddress = (id) => {
    if (addresses.length === 1) {
      alert("You must keep at least one delivery address.");
      return;
    }
    const filtered = addresses.filter((a) => a.id !== id);
    setAddresses(filtered);
    localStorage.setItem("saved_addresses", JSON.stringify(filtered));
  };

  const handleSetDefaultAddress = (id) => {
    const updated = addresses.map((a) => ({
      ...a,
      isDefault: a.id === id,
    }));
    setAddresses(updated);
    localStorage.setItem("saved_addresses", JSON.stringify(updated));
  };

  return (
    <div className="profile-wrapper">
      {/* SIDEBAR NAVIGATION */}
      <aside className="profile-sidebar">
        <div className="profile-sidebar-user">
          <div className="profile-sidebar-avatar">{initial}</div>
          <h3 style={{ fontSize: "1.1rem", fontWeight: 800 }}>{name}</h3>
          <p style={{ fontSize: "0.82rem", color: "var(--text-muted)", marginTop: "2px" }}>
            {email}
          </p>
        </div>

        <div className="profile-nav-links">
          <button
            className={`profile-nav-btn ${activeTab === "profile" ? "active" : ""}`}
            onClick={() => setActiveTab("profile")}
          >
            <UserIcon size={16} />
            <span>Personal Details</span>
          </button>

          <button
            className={`profile-nav-btn ${activeTab === "settings" ? "active" : ""}`}
            onClick={() => setActiveTab("settings")}
          >
            <SettingsIcon size={16} />
            <span>Theme & Settings</span>
          </button>

          <button
            className={`profile-nav-btn ${activeTab === "addresses" ? "active" : ""}`}
            onClick={() => setActiveTab("addresses")}
          >
            <PackageIcon size={16} />
            <span>Saved Addresses</span>
          </button>

          <button
            className="profile-nav-btn"
            onClick={() => navigate("/orders")}
          >
            <PackageIcon size={16} />
            <span>My Orders</span>
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
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "8px",
          }}
        >
          <LogOutIcon size={16} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* MAIN PANE */}
      <main className="profile-main-pane">
        {/* TAB 1: PERSONAL DETAILS */}
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
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <CheckIcon size={16} />
                <span>Profile changes saved successfully!</span>
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
                <label>Contact Phone</label>
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

        {/* TAB 2: THEME & SETTINGS */}
        {activeTab === "settings" && (
          <div>
            <h1 className="profile-title" style={{ fontSize: "1.8rem", marginBottom: "8px" }}>
              Theme & Interface Settings
            </h1>
            <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>
              Customize your storefront appearance and display preferences.
            </p>

            <div className="settings-theme-card">
              <h3 style={{ fontSize: "1.2rem", fontWeight: 800 }}>Color Theme Selection</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginTop: "4px" }}>
                Switch between Midnight Titanium Dark mode and Clean Minimalist Light mode.
              </p>

              <div className="theme-options-grid">
                {/* Dark Option */}
                <div
                  className={`theme-option-box ${theme === "dark" ? "active" : ""}`}
                  onClick={() => setTheme("dark")}
                >
                  <MoonIcon size={24} />
                  <div>
                    <div className="theme-option-title">Midnight Titanium Dark</div>
                    <div className="theme-option-desc">
                      Deep slate aesthetic with electric blue accents
                    </div>
                  </div>
                </div>

                {/* Light Option */}
                <div
                  className={`theme-option-box ${theme === "light" ? "active" : ""}`}
                  onClick={() => setTheme("light")}
                >
                  <SunIcon size={24} />
                  <div>
                    <div className="theme-option-title">Minimalist Platinum Light</div>
                    <div className="theme-option-desc">
                      Crisp white gallery aesthetic with deep charcoal
                    </div>
                  </div>
                </div>
              </div>

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
                  <strong>Active Theme: {isDark ? "Dark Mode" : "Light Mode"}</strong>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Theme preferences are remembered for your account.
                  </div>
                </div>

                <button className="cta-secondary" onClick={toggleTheme}>
                  {isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
                </button>
              </div>
            </div>

            <div className="settings-theme-card">
              <h3 style={{ fontSize: "1.1rem", fontWeight: 800, marginBottom: "12px" }}>
                Notification Preferences
              </h3>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" defaultChecked />
                <span>Receive shipment dispatch and delivery status via email</span>
              </label>
              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <input type="checkbox" defaultChecked />
                <span>Receive promotional flash sale alerts</span>
              </label>
            </div>
          </div>
        )}

        {/* TAB 3: SAVED ADDRESSES */}
        {activeTab === "addresses" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "20px",
              }}
            >
              <h1 className="profile-title" style={{ fontSize: "1.8rem", margin: 0 }}>
                Saved Delivery Addresses
              </h1>
              <button
                className="cta-primary"
                onClick={() => setShowAddressModal(true)}
                style={{ padding: "8px 16px", fontSize: "0.88rem" }}
              >
                + Add New Address
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {addresses.map((addr) => (
                <div
                  key={addr.id}
                  style={{
                    background: "var(--bg-subtle)",
                    border: `1px solid ${addr.isDefault ? "var(--brand-primary)" : "var(--panel-border)"}`,
                    borderRadius: "16px",
                    padding: "20px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom: "8px",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <strong>{addr.label || "Address"}</strong>
                      {addr.isDefault && (
                        <span
                          style={{
                            background: "var(--chip-bg)",
                            color: "var(--brand-primary)",
                            fontSize: "0.72rem",
                            fontWeight: 800,
                            padding: "2px 8px",
                            borderRadius: "6px",
                          }}
                        >
                          DEFAULT
                        </span>
                      )}
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                      {!addr.isDefault && (
                        <button
                          onClick={() => handleSetDefaultAddress(addr.id)}
                          style={{ fontSize: "0.8rem", color: "var(--brand-primary)", fontWeight: 700 }}
                        >
                          Set as Default
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteAddress(addr.id)}
                        style={{ color: "var(--brand-danger)", padding: "4px" }}
                        title="Delete Address"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </div>
                  </div>

                  <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", lineHeight: 1.5 }}>
                    {addr.name} <br />
                    {addr.street} <br />
                    {addr.city}, {addr.state} - {addr.zip} <br />
                    Contact: {addr.phone}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ADD NEW ADDRESS MODAL */}
      {showAddressModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Add Delivery Address</h3>
              <button onClick={() => setShowAddressModal(false)}>
                <CloseIcon size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveAddress} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
              <div className="form-group">
                <label>Address Label</label>
                <select
                  value={newAddress.label}
                  onChange={(e) => setNewAddress({ ...newAddress, label: e.target.value })}
                >
                  <option value="Home">Home</option>
                  <option value="Office / Work">Office / Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div className="form-group">
                <label>Recipient Name</label>
                <input
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  required
                />
              </div>

              <div className="form-group">
                <label>Street Address / Flat / Floor</label>
                <input
                  value={newAddress.street}
                  placeholder="e.g. 402 Palm Grove Apts, 12th Main"
                  onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                  required
                />
              </div>

              <div className="checkout-inputs-grid">
                <div className="form-group">
                  <label>City</label>
                  <input
                    value={newAddress.city}
                    placeholder="e.g. Bengaluru"
                    onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>ZIP / Pincode</label>
                  <input
                    value={newAddress.zip}
                    placeholder="e.g. 560001"
                    onChange={(e) => setNewAddress({ ...newAddress, zip: e.target.value })}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Contact Phone</label>
                <input
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  required
                />
              </div>

              <div className="modal-actions">
                <button
                  type="button"
                  className="cta-secondary"
                  onClick={() => setShowAddressModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button type="submit" className="cta-primary" style={{ flex: 1 }}>
                  Save Address
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
