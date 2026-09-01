import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ProductCard from "./ProductCard";
import { getProducts } from "./services/productService";

export default function Products() {
  const location = useLocation();
  const navigate = useNavigate();

  // STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);

  const [category, setCategory] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  // Extract URL Query Params
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const search = params.get("search") || "";
    const cat = params.get("category") || "all";
    const sort = params.get("sort") || "";

    setSearchTerm(search);
    setCategory(cat);
    if (sort) setSortKey(sort);
    setPage(1);
  }, [location.search]);

  // Fetch Products with Zero-Buffering & Skeleton Support
  useEffect(() => {
    let isCurrent = true;
    setLoading(true);

    async function load() {
      try {
        const res = await getProducts({
          page,
          limit: 12,
          search: searchTerm,
          category,
          rating: ratingFilter,
          price: priceFilter,
          sort: sortKey,
        });

        if (isCurrent) {
          setProducts(res.products || []);
          setTotalPages(res.totalPages || 1);
          setTotalCount(res.total || 0);
          setLoading(false);
        }
      } catch (err) {
        console.error("Products load failed:", err);
        if (isCurrent) {
          setProducts([]);
          setLoading(false);
        }
      }
    }

    load();
    return () => { isCurrent = false; };
  }, [page, searchTerm, category, ratingFilter, priceFilter, sortKey]);

  const handleResetFilters = () => {
    setCategory("all");
    setRatingFilter("");
    setPriceFilter("");
    setSortKey("");
    setSearchTerm("");
    navigate("/products");
  };

  return (
    <div className="products-page">
      <div className="products-header">
        <h1 className="products-title">Explore Catalog</h1>
        <p className="products-subtitle">
          Showing {products.length} of {totalCount} authentic tech products & gadgets
        </p>
      </div>

      {/* FILTER BAR */}
      <div className="products-filterbar">
        {/* Sort */}
        <div className="filter-item">
          <label>Sort By</label>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="">Featured</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
            <option value="rating">Highest Rated</option>
            <option value="discount">Biggest Discount</option>
          </select>
        </div>

        {/* Category */}
        <div className="filter-item">
          <label>Category</label>
          <select
            value={category}
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Categories</option>
            <option value="smartphones">Smartphones</option>
            <option value="laptops">Laptops</option>
            <option value="fragrances">Fragrances</option>
            <option value="groceries">Groceries</option>
          </select>
        </div>

        {/* Rating */}
        <div className="filter-item">
          <label>Rating</label>
          <select
            value={ratingFilter}
            onChange={(e) => {
              setRatingFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">All Ratings</option>
            <option value="4.5">⭐ 4.5 & Above</option>
            <option value="4.0">⭐ 4.0 & Above</option>
          </select>
        </div>

        {/* Price Range */}
        <div className="filter-item">
          <label>Price</label>
          <select
            value={priceFilter}
            onChange={(e) => {
              setPriceFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Any Price</option>
            <option value="low">Budget (Under ₹1,000)</option>
            <option value="high">Premium (₹1,000+)</option>
          </select>
        </div>

        {/* Reset Filter Button */}
        {(searchTerm || category !== "all" || ratingFilter || priceFilter || sortKey) && (
          <button className="reset-filters-btn" onClick={handleResetFilters}>
            ✕ Clear Filters
          </button>
        )}
      </div>

      {/* SEARCH BANNER */}
      {searchTerm && (
        <div className="search-tag-banner">
          <span>
            Search results for: <strong>"{searchTerm}"</strong>
          </span>
          <button
            onClick={() => {
              setSearchTerm("");
              navigate("/products");
            }}
            style={{ color: "var(--brand-danger)", fontWeight: 700 }}
          >
            Clear Search ✕
          </button>
        </div>
      )}

      {/* PRODUCT GRID OR SKELETON */}
      {loading ? (
        <div className="products-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="skeleton skeleton-card" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <div className="products-grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      ) : (
        <div className="no-results">
          <h3>No products match your criteria</h3>
          <p style={{ color: "var(--text-muted)", marginTop: "8px", marginBottom: "18px" }}>
            Try adjusting your search terms or clearing filters.
          </p>
          <button className="cta-primary" onClick={handleResetFilters}>
            Reset All Filters
          </button>
        </div>
      )}

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`page-btn ${page === i + 1 ? "active" : ""}`}
              onClick={() => {
                setPage(i + 1);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
