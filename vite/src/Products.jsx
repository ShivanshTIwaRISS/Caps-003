import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "./services/api";
import ProductCard from "./ProductCard";

export default function Products() {
  const location = useLocation();

  // STATES
  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [category, setCategory] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [sortKey, setSortKey] = useState("");

  // Extract ?search=
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("search") || "";
    setSearchTerm(q);
  }, [location.search]);

  // Fetch from backend
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products", {
        params: {
          page,
          limit: 20,
          search: searchTerm,
          category,
          rating: ratingFilter,
          price: priceFilter,
          sort: sortKey,
        },
      });

      setProducts(res.data.products || []);
      setTotalPages(res.data.totalPages || 1);

    } catch (err) {
      console.log("❌ Products load failed:", err);
      setProducts([]);
      setTotalPages(1);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [page, searchTerm, category, ratingFilter, priceFilter, sortKey]);

  return (
    <div className="products-page">
      <h1 className="products-title">Explore Products</h1>

      {/* FILTER BAR */}
      <div className="products-filterbar">

        {/* Sort */}
        <div className="filter-item">
          <label>Sort</label>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="">None</option>
            <option value="price">Price (Low → High)</option>
            <option value="rating">Rating (High → Low)</option>
          </select>
        </div>

        {/* Category */}
        <div className="filter-item">
          <label>Category</label>
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="all">All</option>
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
            onChange={(e) => setRatingFilter(e.target.value)}
          >
            <option value="">Any</option>
            <option value="4">4★ & Above</option>
            <option value="4.5">4.5★ & Above</option>
          </select>
        </div>

        {/* Price */}
        <div className="filter-item">
          <label>Price</label>
          <select
            value={priceFilter}
            onChange={(e) => setPriceFilter(e.target.value)}
          >
            <option value="">Default</option>
            <option value="low">Low → High</option>
            <option value="high">High → Low</option>
          </select>
        </div>

        {(searchTerm || category !== "all" || ratingFilter || priceFilter) && (
          <button
            className="reset-filters"
            onClick={() => {
              setCategory("all");
              setRatingFilter("");
              setPriceFilter("");
              setSortKey("");
            }}
          >
            Reset
          </button>
        )}
      </div>

      {/* SEARCH TAG */}
      {searchTerm && (
        <div className="search-tag">
          Showing results for: <strong>{searchTerm}</strong>
        </div>
      )}

      {/* GRID */}
      <div className="product-grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            className={`page-btn ${page === i + 1 ? "active" : ""}`}
            key={i}
            onClick={() => setPage(i + 1)}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {products.length === 0 && (
        <div className="no-results">No results found.</div>
      )}
    </div>
  );
}
