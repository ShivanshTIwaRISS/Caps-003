import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { StarIcon, CartIcon, CheckIcon, HeartIcon } from "./components/Icons";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItemToCart, cartItems } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const [addedAnim, setAddedAnim] = useState(false);

  const user = localStorage.getItem("user");

  const openProduct = () => navigate(`/product/${product.id}`);

  const isInCart = cartItems.some(
    (i) => i.productId === product.id || i.id === product.id
  );

  const isWishlisted = isInWishlist(product.id);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!user) {
      navigate("/login");
      return;
    }

    addItemToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });

    setAddedAnim(true);
    setTimeout(() => setAddedAnim(false), 1200);
  };

  const handleToggleWishlist = (e) => {
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="product-card" onClick={openProduct}>
      <div className="product-card-img-wrap">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="product-card-img"
          loading="lazy"
        />

        {product.discountPercentage > 10 && (
          <span className="product-discount-badge">
            {product.discountPercentage}% OFF
          </span>
        )}

        {/* Wishlist Heart Button */}
        <button
          className={`wishlist-card-btn ${isWishlisted ? "active" : ""}`}
          onClick={handleToggleWishlist}
          title={isWishlisted ? "Remove from Wishlist" : "Save to Wishlist"}
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: isWishlisted ? "rgba(239, 68, 68, 0.9)" : "rgba(19, 23, 34, 0.75)",
            backdropFilter: "blur(6px)",
            color: isWishlisted ? "#ffffff" : "#ffffff",
            border: "1px solid rgba(255, 255, 255, 0.2)",
            borderRadius: "50%",
            width: "32px",
            height: "32px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            zIndex: 3,
            transition: "all 0.2s ease",
          }}
        >
          <HeartIcon size={15} filled={isWishlisted} />
        </button>

        {product.rating >= 4.4 && (
          <span className="product-top-badge" style={{ left: "10px", right: "auto", top: "auto", bottom: "10px" }}>
            <StarIcon size={12} filled={true} />
            <span>{product.rating}</span>
          </span>
        )}
      </div>

      <div className="product-info">
        <span className="product-category-tag">{product.category || "Hardware"}</span>
        <h3 className="product-title" title={product.title}>
          {product.title}
        </h3>

        <div className="product-rating-row">
          <div className="rating-stars">
            {Array.from({ length: 5 }).map((_, i) => (
              <StarIcon
                key={i}
                size={13}
                filled={i < Math.round(product.rating || 4)}
              />
            ))}
          </div>
          <span className="rating-count">({product.reviewsCount || 48})</span>
        </div>

        <div className="product-price-row">
          <span className="product-price">₹{product.price.toLocaleString("en-IN")}</span>
          {product.originalPrice && (
            <span className="product-orig-price">
              ₹{product.originalPrice.toLocaleString("en-IN")}
            </span>
          )}
        </div>

        {/* Action Buttons Row */}
        <div className="product-card-actions">
          {!isInCart ? (
            <button
              className="product-cart-btn"
              onClick={handleAddToCart}
              style={addedAnim ? { background: "var(--brand-accent)", color: "#fff" } : {}}
            >
              {addedAnim ? (
                <>
                  <CheckIcon size={16} />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <CartIcon size={16} />
                  <span>Add to Cart</span>
                </>
              )}
            </button>
          ) : (
            <button
              className="product-cart-btn in-cart"
              onClick={(e) => {
                e.stopPropagation();
                navigate("/cart");
              }}
            >
              <CheckIcon size={16} />
              <span>In Cart</span>
            </button>
          )}

          <button
            className="product-view-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/product/${product.id}`);
            }}
            title="View full product details"
          >
            <span>Details</span>
          </button>
        </div>
      </div>
    </div>
  );
}
