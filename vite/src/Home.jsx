import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("all");

  const categories = ["all", "smartphones", "laptops", "fragrances", "skincare"];

  useEffect(() => {
    setLoading(true);

    const url =
      category === "all"
        ? "https://dummyjson.com/products?limit=3"
        : `https://dummyjson.com/products/category/${category}?limit=3`;

    axios
      .get(url)
      .then((res) => {
        setFeaturedProducts(res.data.products || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load featured products");
        setLoading(false);
      });
  }, [category]);

  return (
    <>
      <div className="container">
        
        {/* HERO SECTION */}
        <section className="home-hero">
          <div className="heroContent">
            <h1>Welcome to Our Store</h1>
            <p>Discover amazing products at unbeatable prices</p>
            <Link to="/products" className="ctaButton">
              Shop Now
            </Link>
          </div>
        </section>

        {/* CATEGORY FILTERS */}
        <section className="categoryFilters">
          <div className="categoryScroll">
            {categories.map((cat) => (
              <button
                key={cat}
                className={`categoryButton ${category === cat ? "active" : ""}`}
                onClick={() => setCategory(cat)}
              >
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="featuredSection">
          <h2>Featured Products</h2>

          {loading && <p className="loading">Loading products...</p>}
          {error && <p className="error">{error}</p>}

          <div className="productsGrid">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="ctaSection">
          <h2>Ready to Explore More?</h2>
          <Link to="/products" className="secondaryButton">
            Browse All Products
          </Link>
        </section>
      </div>
    </>
  );
}
