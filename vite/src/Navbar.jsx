import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

// ❌ CART CONTEXT REMOVED (kept commented)
/// import { useCart } from "../../context/CartContext";

// ❌ FIREBASE REMOVED (kept commented)
// import { onAuthStateChanged, signOut } from "firebase/auth";
// import { auth } from "../../firebase";

export default function Navbar() {
  const navigate = useNavigate();
  const inputRef = useRef(null);
  const profileRef = useRef(null);

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  // ⭐ Load logged-in user on first render
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  // ⭐ Dropdown toggle state
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const toggleProfileMenu = () => {
    setShowProfileMenu((prev) => !prev);
  };

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

  // =================== SEARCH AUTO-SUGGEST ===================
  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(() => {
      axios
        .get(
          `https://dummyjson.com/products/search?q=${encodeURIComponent(
            searchTerm.trim()
          )}&limit=5`
        )
        .then((res) => {
          setSuggestions(res.data.products || []);
          setShowDropdown(true);
        });
    }, 300);

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

  // Profile avatar letter
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

     <div className="nav-right">

  {/* SHOW ONLY WHEN LOGGED IN */}
  {user && (
    <>
      {/* ORDERS ICON */}
      <div
        className="nav-orders"
        onClick={() => navigate("/orders")}
        style={{ cursor: "pointer" }}
      >
        📦
      </div>

      {/* CART ICON */}
      <div
        className="nav-cart"
        onClick={() => navigate("/cart")}
        style={{ cursor: "pointer" }}
      >
        🛒
      </div>
    </>
  )}

  {/* IF NOT LOGGED IN: SHOW LOGIN + SIGNUP */}
  {!user && (
    <>
      <button
        className="nav-btn nav-login-btn"
        onClick={() => navigate("/login")}
      >
        Login
      </button>
      <button
        className="nav-btn nav-signup-btn"
        onClick={() => navigate("/signup")}
      >
        Signup
      </button>
    </>
  )}

  {/* PROFILE AVATAR (ONLY WHEN LOGGED IN) */}
  {user && (
    <div className="nav-profile" ref={profileRef}>
      <div
        className="profile-avatar"
        onClick={toggleProfileMenu}
        style={{ cursor: "pointer" }}
      >
        {avatar}
      </div>

      {showProfileMenu && (
        <div className="profile-dropdown">
          <div className="profile-email">{user.email}</div>

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
