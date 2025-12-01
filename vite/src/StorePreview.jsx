import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "./services/api";
import ProductCard from "./ProductCard";

export default function Home() {
  const [featured, setFeatured] = useState([]);
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");

  const categories = [
    "All",
    "Smartphones",
    "Laptops",
    "Fragrances",
    "Groceries",
  ];

  /* ==========================================
      FETCH FEATURED BASED ON CATEGORY (BACKEND)
     ========================================== */
  const fetchCategoryProducts = async () => {
    setLoading(true);

    try {
      const res = await api.get("/products", {
        params: {
          page: 1,
          limit: 8,
          category: category === "All" ? undefined : category.toLowerCase(),
        },
      });

      setFeatured(res.data.products || []);
    } catch (err) {
      console.error("Home category fetch error:", err);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchCategoryProducts();
  }, [category]);

  /* ==========================================
        TRENDING PRODUCTS (BACKEND)
     ========================================== */
  useEffect(() => {
    (async () => {
      try {
        const res = await api.get("/products", {
          params: {
            page: 1,
            limit: 6,
            sort: "rating",
          },
        });

        setTrending(res.data.products || []);
      } catch (err) {
        console.error("Home trending fetch error:", err);
      }
    })();
  }, []);

  return (
    <div className="store home-page">

      {/* ================= HERO ================= */}
      <section className="home-hero neo-hero">
        <div className="neo-hero-left">
          <p className="hero-kicker">⚡ Curated for you</p>
          <h1>
            Welcome to the <span>Next-Gen Store</span>
          </h1>
          <p className="hero-sub">
            Explore futuristic products, cyber-grade tech, and luxury gadgets —
            all in one immersive experience.
          </p>

          <div className="hero-actions">
            <Link to="/products" className="cta">Explore Products</Link>
            <button className="pill">🔥 Today's Deals</button>
          </div>

          {/* CATEGORY FILTERS */}
          <div className="categories home-categories">
            {categories.map((c) => (
              <button
                key={c}
                className={`chip chip--category ${
                  category === c ? "active" : ""
                }`}
                onClick={() => setCategory(c)}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {/* Floating tiles section */}
        <div className="neo-hero-right">
          <div
            className="neo-tile neo-tile--main"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80')",
            }}
          >
            <div className="neo-tile-overlay" />
            <div className="neo-tile-content">
              <span className="neo-pill">Featured Drop</span>
              <h3>Hyperlight Runner</h3>
              <p>Speed, comfort and style for every day.</p>
            </div>
          </div>

          <div
            className="neo-tile neo-tile--small"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1512496015851-a90fb38ba796?auto=format&fit=crop&w=900&q=80')",
            }}
          >
            <div className="neo-tile-overlay" />
            <div className="neo-tile-content mini">
              <p>🎧 Immersive audio</p>
              <span>Noise-cancelling headsets</span>
            </div>
          </div>

          <div
            className="neo-tile neo-tile--small"
            style={{
              backgroundImage:
                "url('https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=900&q=80')",
            }}
          >
            <div className="neo-tile-overlay" />
            <div className="neo-tile-content mini">
              <p>💻 Creator setups</p>
              <span>Powerful laptops & monitors</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURED ================= */}
      <section className="home-section">
        <header className="home-section-head">
          <div>
            <p className="home-tagline">Based on what's trending</p>
            <h2 className="home-section-title">Featured Picks For You</h2>
          </div>
          <Link to="/products" className="linklike">View all →</Link>
        </header>

        {loading ? (
          <p className="home-loading">Loading futuristic items...</p>
        ) : (
          <div className="products">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        )}
      </section>

      {/* ================= TRENDING ================= */}
      <section className="home-section">
        <header className="home-section-head">
          <div>
            <p className="home-tagline">What people are loving right now</p>
            <h2 className="home-section-title small">🔥 Trending Today</h2>
          </div>
        </header>

        <div className="products">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

      {/* ================= METRICS ================= */}
      <section className="home-strip">
        <div className="home-metric">
          <span className="metric-label">Products</span>
          <p className="metric-value">2.3k+</p>
          <span className="metric-sub">Curated across categories</span>
        </div>
        <div className="home-metric">
          <span className="metric-label">Happy Shoppers</span>
          <p className="metric-value">98%</p>
          <span className="metric-sub">Positive satisfaction score</span>
        </div>
        <div className="home-metric">
          <span className="metric-label">Shipping</span>
          <p className="metric-value">40+</p>
          <span className="metric-sub">Cities served in India</span>
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="home-cta">
        <h2>Ready for a deeper dive?</h2>
        <p className="cta-sub">
          Browse the full catalog, compare specs, and build your dream setup.
        </p>
        <Link to="/products" className="cta home-cta-btn">
          Browse Full Store
        </Link>
      </section>
    </div>
  );
}
