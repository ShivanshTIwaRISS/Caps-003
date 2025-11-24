import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import ProductCard from "./ProductCard";

export default function Products() {
  const location = useLocation();

  const [searchTerm, setSearchTerm] = useState("");
  const [products, setProducts] = useState([]);

  // ❌ REMOVED LOCALSTORAGE — wishlist now in-memory only
  const [wishlist, setWishlist] = useState([]);

  const [page, setPage] = useState(1);
  const [sortKey, setSortKey] = useState("");
  const [category, setCategory] = useState("all");
  const [ratingFilter, setRatingFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");

  const [totalPages, setTotalPages] = useState(1);
  const PRODUCTS_PER_PAGE = 20;

  // -------------------------------------
  // Extract search query
  // -------------------------------------
  useEffect(() => {
    const q = new URLSearchParams(location.search).get("search") || "";
    setSearchTerm(q);
  }, [location.search]);

  // -------------------------------------
  // Fetch products
  // -------------------------------------
  const fetchProducts = useCallback(() => {
    let url = `https://dummyjson.com/products?limit=${PRODUCTS_PER_PAGE}&skip=${
      (page - 1) * PRODUCTS_PER_PAGE
    }`;

    if (searchTerm.trim()) {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(
        searchTerm
      )}&limit=${PRODUCTS_PER_PAGE}&skip=${
        (page - 1) * PRODUCTS_PER_PAGE
      }`;
    }

    if (category !== "all") {
      url = `https://dummyjson.com/products/category/${category}`;
    }

    axios.get(url).then((res) => {
      let items = res.data.products || [];

      // Rating filter
      if (ratingFilter) {
        items = items.filter((p) => p.rating >= Number(ratingFilter));
      }

      // Price filter
      if (priceFilter === "low") items.sort((a, b) => a.price - b.price);
      if (priceFilter === "high") items.sort((a, b) => b.price - a.price);

      // Sort options
      if (sortKey === "price") items.sort((a, b) => a.price - b.price);
      if (sortKey === "rating") items.sort((a, b) => b.rating - a.rating);

      // APPLY wishlist mapping
      const updated = items.map((product) => ({
        ...product,
        isInWishlist: wishlist.includes(product.id),
      }));

      setProducts(updated);

      const total = res.data.total || items.length;
      setTotalPages(Math.ceil(total / PRODUCTS_PER_PAGE));
    });
  }, [page, searchTerm, sortKey, category, ratingFilter, priceFilter, wishlist]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // -------------------------------------
  // Wishlist toggle (IN-MEMORY ONLY)
  // -------------------------------------
  const handleWishlistToggle = (id) => {
    setWishlist((prev) => {
      let updated;
      if (prev.includes(id)) updated = prev.filter((x) => x !== id);
      else updated = [...prev, id];
      return updated; // ❌ NO LOCALSTORAGE ANYMORE
    });
  };

  return (
    <div className="products-page">
      <h1 className="products-title">Explore Products</h1>

      {/* FILTER BAR */}
      <div className="products-filterbar">
        <div className="filter-item">
          <label>Sort</label>
          <select value={sortKey} onChange={(e) => setSortKey(e.target.value)}>
            <option value="">None</option>
            <option value="price">Price (Low → High)</option>
            <option value="rating">Rating (High → Low)</option>
          </select>
        </div>

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
          <ProductCard
            key={p.id}
            product={p}
            onWishlistToggle={handleWishlistToggle}
          />
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
