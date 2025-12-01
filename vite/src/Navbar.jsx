import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./services/api"; 

export default function Navbar() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const profileRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // ⭐ User state
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const toggleProfileMenu = () => setShowProfileMenu((prev) => !prev);

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handler = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // =================== BACKEND SEARCH AUTO-SUGGEST ===================
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const res = await api.get("/products", {
          params: {
            search: searchTerm.trim(),
            page: 1,
            limit: 5,
          },
        });

        setSuggestions(res.data.products || []);
        setShowDropdown(true);
      } catch (err) {
        console.log("Suggest error:", err);
      }
    }, 250);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    setShowDropdown(false);
    setSearchTerm("");
  };

  // ================= LOGOUT =================
  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  const avatar = user?.name ? user.name.charAt(0).toUpperCase() : "?";

  return (
    <nav className="navbar">
      {/* LEFT — LOGO */}
      <div
        className="brand"
        onClick={() => navigate("/home")}
        style={{ cursor: "pointer" }}
      >
        <span className="brand-dot" /> OS
      </div>

      {/* SEARCH BAR */}
      <div className="nav-search" ref={inputRef}>
        <form className="nav-search-bar" onSubmit={handleSearch}>
          <input
            type="text"
            placeholder="Search futuristic products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => searchTerm && setShowDropdown(true)}
          />
          <button type="submit">🔍</button>
        </form>

        {showDropdown && suggestions.length > 0 && (
          <ul className="nav-suggestions">
            {suggestions.map((prod) => (
              <li
                key={prod.id}
                onMouseDown={() => navigate(`/product/${prod.id}`)}
              >
                {prod.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT SIDE */}
      <div className="nav-right">

        {user && (
          <>
            <div
              className="nav-orders"
              onClick={() => navigate("/orders")}
              style={{ cursor: "pointer" }}
            >
              📦
            </div>

            <div
              className="nav-cart"
              onClick={() => navigate("/cart")}
              style={{ cursor: "pointer" }}
            >
              🛒
            </div>
          </>
        )}

        {!user && (
          <>
            <button className="nav-btn nav-login-btn" onClick={() => navigate("/login")}>
              Login
            </button>
            <button className="nav-btn nav-signup-btn" onClick={() => navigate("/signup")}>
              Signup
            </button>
          </>
        )}

        {user && (
          <div className="nav-profile" ref={profileRef}>
            <div
              className="profile-avatar"
              onClick={() => navigate("/profile")}

              style={{ cursor: "pointer" }}
            >
              {avatar}
            </div>

            {showProfileMenu && (
              <div className="profile-dropdown">

                {/*  PROFILE BUTTON */}
                <button
                  className="profile-option"
                  onClick={() => {
                    navigate("/profile");
                    setShowProfileMenu(false);
                  }}
                >
                  View Profile
                </button>

                <div className="profile-email">{user.email}</div>

                {/*  LOGOUT BUTTON */}
                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}

      </div>
    </nav>
  );
}
