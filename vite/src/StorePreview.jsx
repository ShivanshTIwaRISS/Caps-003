import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";
import { Link } from "react-router-dom";

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
    "Groceries"
  ];

  const fetchCategoryProducts = async () => {
    setLoading(true);

    const apiUrl =
      category === "All"
        ? "https://dummyjson.com/products?limit=8"
        : `https://dummyjson.com/products/category/${category.toLowerCase()}?limit=8`;

    try {
      const res = await axios.get(apiUrl);
      setFeatured(res.data.products);
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchCategoryProducts();
  }, [category]);

  useEffect(() => {
    (async () => {
      try {
        const trend = await axios.get(
          "https://dummyjson.com/products?sortBy=rating&order=desc&limit=6"
        );
        setTrending(trend.data.products);
      } catch (e) {
        console.error(e);
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
            <Link to="/products" className="cta">
              Explore Products
            </Link>
            <button className="pill">🔥 Today&apos;s Deals</button>
          </div>

          {/* categories */}
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

        {/* Floating tiles grid */}
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
            <p className="home-tagline">Based on what&apos;s trending</p>
            <h2 className="home-section-title">Featured Picks For You</h2>
          </div>
          <Link to="/products" className="linklike">
            View all →
          </Link>
        </header>

        {loading ? (
          <p className="home-loading">Loading futuristic items...</p>
        ) : (
          <div className="products">
            {featured.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onWishlistToggle={() => {}}
              />
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
            <ProductCard key={p.id} product={p} onWishlistToggle={() => {}} />
          ))}
        </div>
      </section>

      {/* ================= WIDGETS ================= */}
      <section className="home-widgets">
        <div className="auth-pane widget-card">
          <h3>👤 People You May Like</h3>
          <ul className="widget-chips">
            <li>Rohit Sharma</li>
            <li>Ana Gomez</li>
            <li>Marcus Lee</li>
            <li>Kaira Kapoor</li>
          </ul>
        </div>

        <div className="auth-pane widget-card">
          <h3>🎧 Now Playing</h3>
          <p className="widget-sub">“Heat Waves” — Glass Animals</p>
          <div className="bars">
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className="auth-pane widget-card">
          <h3>🌤 Weather</h3>
          <p className="widget-temp">28°C</p>
          <p className="widget-sub">New Delhi · Clear sky</p>
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
