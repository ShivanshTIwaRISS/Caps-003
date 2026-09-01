import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { getSearchSuggestions } from "./services/productService";
import {
  SearchIcon,
  CartIcon,
  PackageIcon,
  SettingsIcon,
  LogOutIcon,
} from "./components/Icons";

export default function Navbar() {
  const navigate = useNavigate();
  const searchContainerRef = useRef(null);
  const profileRef = useRef(null);

  const { totalItems } = useCart();

  const [searchTerm, setSearchTerm] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    const checkUser = () => {
      const saved = localStorage.getItem("user");
      setUser(saved ? JSON.parse(saved) : null);
    };
    window.addEventListener("storage", checkUser);
    return () => window.removeEventListener("storage", checkUser);
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setSuggestions([]);
      return;
    }

    const delay = setTimeout(async () => {
      try {
        const results = await getSearchSuggestions(searchTerm, 5);
        setSuggestions(results);
        setShowDropdown(true);
      } catch (err) {
        console.error("Suggest error:", err);
      }
    }, 180);

    return () => clearTimeout(delay);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;

    navigate(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    setShowDropdown(false);
    setSearchTerm("");
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    setUser(null);
    setShowProfileMenu(false);
    navigate("/login");
  };

  const avatar = user?.name ? user.name.charAt(0).toUpperCase() : "U";

  const categories = [
    { label: "All Products", path: "/products" },
    { label: "Flash Deals", path: "/products?sort=discount" },
    { label: "Smartphones", path: "/products?category=smartphones" },
    { label: "Laptops", path: "/products?category=laptops" },
    { label: "Fragrances", path: "/products?category=fragrances" },
    { label: "Groceries", path: "/products?category=groceries" },
  ];

  return (
    <>
      <nav className="navbar">
        {/* BRAND LOGO */}
        <div className="brand" onClick={() => navigate("/")} title="OS Store Home">
          <span className="brand-dot" />
          <span>OS STORE</span>
          <span className="brand-tag">v3.0</span>
        </div>

        {/* SEARCH BAR */}
        <div className="nav-search" ref={searchContainerRef}>
          <form className="nav-search-bar" onSubmit={handleSearchSubmit}>
            <SearchIcon size={16} />
            <input
              type="text"
              placeholder="Search products, laptops, smartphones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => searchTerm && setShowDropdown(true)}
            />
            <button type="submit" aria-label="Search">
              Search
            </button>
          </form>

          {showDropdown && suggestions.length > 0 && (
            <ul className="nav-suggestions">
              {suggestions.map((prod) => (
                <li
                  key={prod.id}
                  className="nav-suggestion-item"
                  onMouseDown={() => {
                    navigate(`/product/${prod.id}`);
                    setShowDropdown(false);
                    setSearchTerm("");
                  }}
                >
                  <img
                    src={prod.thumbnail}
                    alt={prod.title}
                    className="nav-suggestion-thumb"
                  />
                  <div className="nav-suggestion-info">
                    <div className="nav-suggestion-title">{prod.title}</div>
                    <div className="nav-suggestion-price">₹{prod.price.toLocaleString("en-IN")}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* RIGHT ACTIONS */}
        <div className="nav-right">
          {/* Orders Link */}
          {user && (
            <button
              className="nav-icon-btn"
              onClick={() => navigate("/orders")}
              title="My Orders"
              aria-label="My Orders"
            >
              <PackageIcon size={18} />
            </button>
          )}

          {/* Cart Icon with Counter */}
          <button
            className="nav-icon-btn"
            onClick={() => navigate("/cart")}
            title="Shopping Cart"
            aria-label="Shopping Cart"
          >
            <CartIcon size={18} />
            {totalItems > 0 && <span className="nav-badge">{totalItems}</span>}
          </button>

          {!user && (
            <>
              <button className="nav-btn nav-login-btn" onClick={() => navigate("/login")}>
                Sign In
              </button>
              <button className="nav-btn nav-signup-btn" onClick={() => navigate("/signup")}>
                Sign Up
              </button>
            </>
          )}

          {user && (
            <div className="nav-profile" ref={profileRef}>
              <div
                className="profile-avatar"
                onClick={() => setShowProfileMenu((prev) => !prev)}
                title="Account & Settings"
              >
                {avatar}
              </div>

              {showProfileMenu && (
                <div className="profile-dropdown">
                  <div className="profile-dropdown-user">
                    <div className="profile-name">{user.name}</div>
                    <div className="profile-email">{user.email}</div>
                  </div>

                  <button
                    className="profile-menu-item"
                    onClick={() => {
                      navigate("/profile");
                      setShowProfileMenu(false);
                    }}
                  >
                    <SettingsIcon size={16} />
                    <span>Settings & Profile</span>
                  </button>

                  <button
                    className="profile-menu-item"
                    onClick={() => {
                      navigate("/orders");
                      setShowProfileMenu(false);
                    }}
                  >
                    <PackageIcon size={16} />
                    <span>My Orders</span>
                  </button>

                  <button
                    className="profile-menu-item logout-btn"
                    onClick={handleLogout}
                  >
                    <LogOutIcon size={16} />
                    <span>Sign Out</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </nav>

      {/* SUB-BAR CATEGORIES */}
      <div className="nav-subbar">
        {categories.map((c, i) => (
          <Link
            key={i}
            to={c.path}
            className={`nav-sub-item ${c.path.includes("discount") ? "deal-highlight" : ""}`}
          >
            {c.label}
          </Link>
        ))}
      </div>
    </>
  );
}
