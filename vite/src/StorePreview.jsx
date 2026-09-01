import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { getProducts, getFlashDeals } from "./services/productService";
import {
  ClockIcon,
  ArrowRightIcon,
  ShieldIcon,
  TruckIcon,
  CheckIcon,
  SparklesIcon,
} from "./components/Icons";

export default function Home() {
  const navigate = useNavigate();
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [flashDeals, setFlashDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

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
    { label: "Smartphones", value: "smartphones" },
    { label: "Laptops", value: "laptops" },
    { label: "Fragrances", value: "fragrances" },
    { label: "Groceries", value: "groceries" },
  ];

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
    return () => {
      isMounted = false;
    };
  }, [category]);

  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="neo-hero">
        <div className="neo-hero-left">
          <span className="hero-kicker">
            <SparklesIcon size={14} /> India's Favourite Online Store
          </span>
          <h1>
            Everything You Need, <span>All in One Place</span>
          </h1>
          <p className="hero-sub">
            From flagship smartphones and laptops to fresh groceries, luxury fragrances, fashion, footwear, and home essentials — shop across 10+ categories with same-day dispatch and free returns.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="cta-primary">
              <span>Explore Full Catalog</span>
              <ArrowRightIcon size={16} />
            </Link>
            <button
              className="cta-secondary"
              onClick={() => {
                const dealsSection = document.getElementById("flash-deals-section");
                dealsSection?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Today's Deals
            </button>
          </div>

          {/* Category Filter Chips */}
          <div className="home-categories">
            {categories.map((c) => (
              <button
                key={c.value}
                className={`chip ${category.toLowerCase() === c.value.toLowerCase() ? "active" : ""}`}
                onClick={() => setCategory(c.label)}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {/* Hero Right Visual Tiles with EXACT Matching Imagery */}
        <div className="neo-hero-right">
          {/* Tile 1: Athletic Shoes */}
          <div
            className="neo-tile neo-tile--main"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80')",
            }}
            onClick={() => navigate("/products?category=footwear")}
            role="button"
          >
            <div className="neo-tile-overlay" />
            <div className="neo-tile-content">
              <span className="neo-pill">Performance Series</span>
              <h3>Athletic Performance Footwear</h3>
              <p>High-traction ergonomic running shoes and trainers.</p>
            </div>
          </div>

          {/* Tile 2: Audio & Headphones (Accurate high-res audio photo) */}
          <div
            className="neo-tile neo-tile--small"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80')",
            }}
            onClick={() => navigate("/products?search=headphones")}
            role="button"
          >
            <div className="neo-tile-overlay" />
            <div className="neo-tile-content mini">
              <p>Studio Audio Systems</p>
              <span>ANC Headsets & Earbuds</span>
            </div>
          </div>

          {/* Tile 3: Laptops & Workstations */}
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
              <p>Pro Silicon Workstations</p>
              <span>High-Performance Laptops</span>
            </div>
          </div>
        </div>
      </section>

      {/* FLASH DEALS SECTION */}
      <section className="flash-deals-banner" id="flash-deals-section">
        <div className="flash-deals-header">
          <div className="flash-title-area">
            <span className="flash-badge">LIMITED TIME</span>
            <h3 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Exclusive Daily Promotions</h3>
          </div>

          <div className="flash-countdown">
            <ClockIcon size={16} />
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
                <span className="flash-price">₹{deal.price.toLocaleString("en-IN")}</span>
                <span className="flash-orig-price">₹{deal.originalPrice.toLocaleString("en-IN")}</span>
              </div>
              <div className="flash-progress-bar">
                <div
                  className="flash-progress-fill"
                  style={{ width: `${Math.min(85, deal.stock * 3)}%` }}
                />
              </div>
              <div className="flash-stock-text">
                <span>High Demand</span>
                <span>{deal.stock} units remaining</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="home-section">
        <header className="home-section-head">
          <div>
            <p className="home-tagline">Curated Picks</p>
            <h2 className="home-section-title">Featured Products</h2>
          </div>
          <Link to="/products" className="linklike-cta">
            <span>View Full Catalog</span>
            <ArrowRightIcon size={16} />
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

      {/* TOP RATED */}
      <section className="home-section">
        <header className="home-section-head">
          <div>
            <p className="home-tagline">Highest Rated</p>
            <h2 className="home-section-title">Top Rated & Trending</h2>
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

      {/* TRUST BADGES */}
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
          <div style={{ color: "var(--brand-primary)" }}><TruckIcon size={28} /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>Free Express Delivery</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>On all orders across India</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ color: "var(--brand-accent)" }}><CheckIcon size={28} /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>7-Day Replacement</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Hassle-free doorstep returns</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ color: "var(--brand-primary)" }}><ShieldIcon size={28} /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>256-Bit SSL Secured</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>UPI, Cards & Verified COD</div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
          <div style={{ color: "var(--brand-warning)" }}><SparklesIcon size={28} /></div>
          <div>
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>100% Authentic Products</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>Verified sellers across all categories</div>
          </div>
        </div>
      </section>

      {/* CTA BANNER */}
      <section
        style={{
          textAlign: "center",
          padding: "48px 24px",
          background: "var(--panel)",
          border: "1px solid var(--panel-border)",
          borderRadius: "24px",
        }}
      >
        <h2 style={{ fontSize: "2.2rem", fontWeight: 800, marginBottom: "10px" }}>
          Start Shopping Across Categories
        </h2>
        <p style={{ color: "var(--text-muted)", maxWidth: "550px", margin: "0 auto 24px" }}>
          Join millions of happy customers who shop smartphones, groceries, fashion, fragrances, laptops, footwear, and more on OS Store — all delivered to your door.
        </p>
        <Link to="/products" className="cta-primary">
          <span>Browse All Categories</span>
          <ArrowRightIcon size={16} />
        </Link>
      </section>
    </div>
  );
}
