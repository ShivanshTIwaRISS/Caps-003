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

  // ❌ USER REMOVED (keep commented)
  // const [user, setUser] = useState(null);

  // ❌ CART REMOVED (keep commented)
  // const { totalItems } = useCart();

  // ❌ FIREBASE AUTH LISTENER REMOVED (keep commented)
  /*
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsub();
  }, []);
  */

  // ================= SEARCH AUTO-SUGGEST =================
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

  // Close dropdown on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        // nothing now
      }
    };

    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // ❌ LOGOUT (kept commented)
  // const handleLogout = async () => {
  //   await signOut(auth);
  //   navigate("/login");
  // };

  return (
    <nav className="navbar">
      {/* LEFT — LOGO */}
      <div className="nav-logo">
        <Link to="/home">
          <img src="/image.png" alt="OS" />
        </Link>
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
                onMouseDown={() =>
                  navigate(`/product/${prod.id}`) // Go to product details
                }
              >
                {prod.title}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* RIGHT SECTION */}
      <div className="nav-right">
        {/* Login + Signup */}
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

        {/* ❌ PROFILE UI REMOVED (keep commented)
        <div className="nav-profile" ref={profileRef}> ... </div>
        */}

        {/* ❌ CART REMOVED (keep commented)
        <Link to="/cart" className="nav-cart">
          🛒 Cart
          {totalItems > 0 && (
            <span className="nav-cart-badge">{totalItems}</span>
          )}
        </Link>
        */}
      </div>
    </nav>
  );
}
