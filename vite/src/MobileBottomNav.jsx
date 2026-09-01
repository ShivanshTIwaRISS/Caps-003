import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { HomeIcon, SearchIcon, CartIcon, PackageIcon, UserIcon, HeartIcon } from "./components/Icons";

export default function MobileBottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { totalItems } = useCart();
  const { totalWishlistItems } = useWishlist();

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch { return null; }
  })();

  const isActive = (path) => location.pathname === path;

  const tabs = [
    {
      label: "Home",
      path: "/",
      icon: <HomeIcon size={20} />,
    },
    {
      label: "Wishlist",
      path: user ? "/wishlist" : "/login",
      icon: (
        <span style={{ position: "relative", display: "inline-flex" }}>
          <HeartIcon size={20} />
          {user && totalWishlistItems > 0 && (
            <span
              style={{
                position: "absolute",
                top: -5,
                right: -7,
                background: "var(--brand-danger)",
                color: "#fff",
                fontSize: "0.58rem",
                fontWeight: 800,
                minWidth: 15,
                height: 15,
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 3px",
                lineHeight: 1,
              }}
            >
              {totalWishlistItems}
            </span>
          )}
        </span>
      ),
    },
    {
      label: "Cart",
      path: user ? "/cart" : "/login",
      icon: (
        <span style={{ position: "relative", display: "inline-flex" }}>
          <CartIcon size={20} />
          {totalItems > 0 && (
            <span
              style={{
                position: "absolute",
                top: -5,
                right: -7,
                background: "var(--brand-primary)",
                color: "#fff",
                fontSize: "0.58rem",
                fontWeight: 800,
                minWidth: 15,
                height: 15,
                borderRadius: "999px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "0 3px",
                lineHeight: 1,
              }}
            >
              {totalItems}
            </span>
          )}
        </span>
      ),
    },
    {
      label: "Orders",
      path: user ? "/orders" : "/login",
      icon: <PackageIcon size={20} />,
    },
    {
      label: user ? "Account" : "Sign In",
      path: user ? "/profile" : "/login",
      icon: <UserIcon size={20} />,
    },
  ];

  // Hide on auth pages
  if (["/login", "/signup"].includes(location.pathname)) return null;

  return (
    <nav className="mobile-bottom-nav">
      {tabs.map((tab) => {
        const active = isActive(tab.path);
        return (
          <button
            key={tab.label}
            className={`mobile-bottom-tab ${active ? "active" : ""}`}
            onClick={() => {
              if (tab.path === "/login" && !user) {
                alert("Please sign in to access " + tab.label);
              }
              navigate(tab.path);
            }}
          >
            <span className="mobile-tab-icon">{tab.icon}</span>
            <span className="mobile-tab-label">{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
