import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useWishlist } from "./WishlistContext";
import { useCart } from "./CartContext";
import { HeartIcon, CartIcon, TrashIcon, ArrowRightIcon } from "./components/Icons";

export default function Wishlist() {
  const navigate = useNavigate();
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist();
  const { addItemToCart } = useCart();

  const user = localStorage.getItem("user");

  if (!user) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div style={{ color: "var(--brand-danger)", marginBottom: "16px" }}>
            <HeartIcon size={54} />
          </div>
          <h2>Sign In to View Wishlist</h2>
          <p style={{ color: "var(--text-muted)", margin: "8px 0 24px" }}>
            You need an active OS account to view and save your wishlist.
          </p>
          <Link to="/login" className="cta-primary">
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  if (wishlistItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <div style={{ color: "var(--text-dim)", marginBottom: "16px" }}>
            <HeartIcon size={54} />
          </div>
          <h2>Your Wishlist is Empty</h2>
          <p style={{ color: "var(--text-muted)", margin: "8px 0 24px" }}>
            Explore our curated catalog and tap the heart icon to save products for later.
          </p>
          <Link to="/products" className="cta-primary">
            <span>Explore Catalog</span>
            <ArrowRightIcon size={16} />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <h1 className="cart-title" style={{ margin: 0 }}>
          My Saved Wishlist ({wishlistItems.length} items)
        </h1>
        <button
          onClick={clearWishlist}
          style={{
            color: "var(--brand-danger)",
            fontSize: "0.85rem",
            fontWeight: 700,
          }}
        >
          Clear Wishlist
        </button>
      </div>

      <div className="products-grid">
        {wishlistItems.map((item) => (
          <div key={item.id} className="product-card" onClick={() => navigate(`/product/${item.id}`)}>
            <div className="product-card-img-wrap">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="product-card-img"
              />
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFromWishlist(item.id);
                }}
                style={{
                  position: "absolute",
                  top: "10px",
                  right: "10px",
                  background: "rgba(239, 68, 68, 0.15)",
                  color: "var(--brand-danger)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "50%",
                  width: "32px",
                  height: "32px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                }}
                title="Remove from Wishlist"
              >
                <TrashIcon size={14} />
              </button>
            </div>

            <div className="product-info">
              <span className="product-category-tag">{item.category || "Hardware"}</span>
              <h3 className="product-title" title={item.title}>
                {item.title}
              </h3>

              <div className="product-price-row">
                <span className="product-price">₹{Number(item.price).toLocaleString("en-IN")}</span>
                {item.originalPrice && (
                  <span className="product-orig-price">
                    ₹{Number(item.originalPrice).toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              <button
                className="product-cart-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  addItemToCart({
                    productId: item.id,
                    title: item.title,
                    price: item.price,
                    thumbnail: item.thumbnail,
                  });
                }}
                style={{ marginTop: "auto" }}
              >
                <CartIcon size={16} />
                <span>Move to Cart</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
