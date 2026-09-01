import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { getProducts, getFlashDeals } from "./services/productService";

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  // Countdown timer for Flash Deals (HH:MM:SS)
  const [timeLeft, setTimeLeft] = useState({ hours: 4, minutes: 28, seconds: 45 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return { hours: 12, minutes: 0, seconds: 0 };
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const categories = [
    { label: "All", value: "all" },
    { label: "📱 Smartphones", value: "smartphones" },
    { label: "💻 Laptops", value: "laptops" },
    { label: "✨ Fragrances", value: "fragrances" },
    { label: "🥑 Groceries", value: "groceries" },
  ];

  /* ----------------------------------------------------
     FETCH FEATURED BY CATEGORY & TRENDING (Zero Buffering)
     ---------------------------------------------------- */
  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    async function loadData() {
      try {
        const [featuredRes, trendingRes, flashRes] = await Promise.all([
          getProducts({
            page: 1,
            limit: 8,
            category: category.toLowerCase() === "all" ? "all" : category.toLowerCase(),
          }),
          getProducts({ page: 1, limit: 4, sort: "rating" }),
          getFlashDeals(4),
        ]);

        if (isMounted) {
          setFeatured(featuredRes.products || []);
          setTrending(trendingRes.products || []);
          setFlashDeals(flashRes || []);
          setLoading(false);
        }
      } catch (err) {
        console.error("Home loading error:", err);
        if (isMounted) setLoading(false);
      }
    }

    loadData();
    return () => { isMounted = false; };
  }, [category]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="home-page">
      {/* ================= HERO SECTION ================= */}
      <section className="neo-hero">
        <div className="neo-hero-left">
          <span className="hero-kicker">⚡ Next-Generation Shopping Experience</span>
          <h1>
            Discover Tomorrow's <span>Tech & Gadgets</span> Today
          </h1>
          <p className="hero-sub">
            Explore cyber-grade hardware, flagship smartphones, ultrabooks, and luxury lifestyle picks with lightning-fast delivery and verified authentic quality.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="cta-primary">
              Explore Full Catalog →
            </Link>
            <button
              className="cta-secondary"
              onClick={() => {
                const dealsSection = document.getElementById("flash-deals-section");
                dealsSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              🔥 Today's Flash Deals
            </button>
          </div>

          {/* Quick Category Filter Chips */}
          <div className="home-categories">
            {categories.map((c) => (
              <button
                key={c.value}
                className={`chip ${category.toLowerCase() === c.value.toLowerCase() ? "active" : ""}`}
                onClick={() => setCategory(c.label.replace(/[^a-zA-Z]/g, ""))}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Right Interactive Tiles */}
        <div className="neo-hero-right">
          <div
            className="neo-tile neo-tile--main"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80')",
            }}
            onClick={() => navigate("/products?category=smartphones")}
            role="button"
          >
            <div className="neo-tile-overlay" />
            <div className="neo-tile-content">
              <span className="neo-pill">Special Drop</span>
              <h3>Cyber Sneakers & Wearables</h3>
              <p>Hyper-cushioning and smart ergonomics.</p>
            </div>
          </div>

          <div
            className="neo-tile neo-tile--small"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80')",
            }}
            onClick={() => navigate("/products?category=laptops")}
            role="button"
          >
            <div className="neo-tile-overlay" />
            <div className="neo-tile-content mini">
              <p>🎧 Studio Grade Audio</p>
              <span>ANC Wireless Headphones</span>
            </div>
          </div>

          <div
            className="neo-tile neo-tile--small"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80')",
            }}
            onClick={() => navigate("/products?category=laptops")}
            role="button"
          >
            <div className="neo-tile-overlay" />
            <div className="neo-tile-content mini">
              <p>💻 Pro Workstations</p>
              <span>M-Series Silicon & GPUs</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FLASH DEALS SECTION ================= */}
      <section className="flash-deals-banner" id="flash-deals-section">
        <div className="flash-deals-header">
          <div className="flash-title-area">
            <span className="flash-badge">⚡ FLASH SALE</span>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Limited Time Cyber Specials</h3>
          </div>

          <div className="flash-countdown">
            <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Ending in:</span>
            <span className="countdown-box">{pad(timeLeft.hours)}h</span>:
            <span className="countdown-box">{pad(timeLeft.minutes)}m</span>:
            <span className="countdown-box">{pad(timeLeft.seconds)}s</span>
          </div>
        </div>

        <div className="flash-grid">
          {flashDeals.map((deal) => (
            <div
              key={deal.id}
              className="flash-card"
              onClick={() => navigate(`/product/${deal.id}`)}
            >
              <img src={deal.thumbnail} alt={deal.title} className="flash-card-img" />
              <div className="flash-card-title">{deal.title}</div>
              <div className="flash-prices">
                <span className="flash-price">₹{deal.price}</span>
                <span className="flash-orig-price">₹{deal.originalPrice}</span>
              </div>
              <div className="flash-progress-bar">
                <div className="flash-progress-fill" style={{ width: `${Math.min(85, deal.stock * 3)}%` }} />
              </div>
              <div className="flash-stock-text">
                <span>🔥 Almost Sold Out</span>
                <span>{deal.stock} left</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURED PICKS ================= */}
      <section className="home-section">
        <header className="home-section-head">
          <div>
            <p className="home-tagline">Handpicked for you</p>
            <h2 className="home-section-title">Featured Products</h2>
          </div>
          <Link to="/products" className="linklike-cta">
            View full catalog →
          </Link>
        </header>

        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ================= TRENDING TODAY ================= */}
      <section className="home-section">
        <header className="home-section-head">
          <div>
            <p className="home-tagline">Most loved this week</p>
            <h2 className="home-section-title">🔥 Top Rated & Trending</h2>
          </div>
        </header>

        {loading ? (
          <div className="products-grid">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="skeleton skeleton-card" />
            ))}
          </div>
        ) : (
          <div className="products-grid">
            {trending.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ================= TRUST BADGES & METRICS ================= */}
      <section
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "16px",
          background: "var(--panel)",
          border: "1px solid var(--panel-border)",
          borderRadius: "20px",
          padding: "24px",
          marginBottom: "48px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "2rem" }}>🚀</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>Free Express Delivery</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>On all prepaid orders over ₹499</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "2rem" }}>🛡️</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>7-Day Easy Returns</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Instant replacement or refund</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "2rem" }}>🔒</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>256-Bit SSL Secured</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>UPI, Cards & Net Banking</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <span style={{ fontSize: "2rem" }}>💬</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>24/7 Dedicated Support</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Expert assistance anytime</div>
          </div>
        </div>
      </section>

      {/* ================= CTA BANNER ================= */}
      <section
        style={{
          textAlign: "center",
          padding: "48px 24px",
          background: "linear-gradient(135deg, rgba(99, 102, 241, 0.2), rgba(6, 182, 212, 0.15))",
          border: "1px solid var(--panel-border)",
          borderRadius: "24px",
        }}
      >
        <h2 style={{ fontSize: "2.2rem", fontWeight: 900, marginBottom: "10px" }}>
          Ready to Upgrade Your Tech Setup?
        </h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "550px", margin: "0 auto 24px" }}>
          Join over 50,000+ satisfied tech enthusiasts who choose OS Store for authentic, warranty-backed gear.
        </p>
        <Link to="/products" className="cta-primary">
          Browse All Products →
        </Link>
      </section>
    </div>
  );
}
