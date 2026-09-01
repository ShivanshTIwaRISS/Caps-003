import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

export default function ProductCard({ product }) {
  const navigate = useNavigate();
  const { addItemToCart, cartItems } = useCart();
  const [addedAnim, setAddedAnim] = useState(false);

  const user = localStorage.getItem("user");

  const openProduct = () => navigate(`/product/${product.id}`);

  // Check if item already exists in cart
  const isInCart = cartItems.some(
    (i) => i.productId === product.id || i.id === product.id
  );

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

  // Generate dynamic estimated delivery date (2 days from now)
  const getDeliveryDate = () => {
    const d = new Date();
    d.setDate(d.getDate() + 2);
    return d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
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

        {product.rating >= 4.4 && (
          <span className="product-top-badge">
            ⭐ {product.rating} Top Rated
          </span>
        )}
      </div>

      <div className="product-info">
        <span className="product-category-tag">{product.category || "Gadgets"}</span>
        <h3 className="product-title" title={product.title}>
          {product.title}
        </h3>

        <div className="product-rating-row">
          <span className="rating-stars">
            {"★".repeat(Math.round(product.rating || 4))}
            <span style={{ opacity: 0.35 }}>
              {"★".repeat(5 - Math.round(product.rating || 4))}
            </span>
          </span>
          <span className="rating-count">({product.reviewsCount || 48})</span>
        </div>

        <div className="product-price-row">
          <span className="product-price">₹{product.price}</span>
          {product.originalPrice && (
            <span className="product-orig-price">₹{product.originalPrice}</span>
          )}
        </div>

        <p className="product-delivery-tag">
          Free Delivery by <strong>{getDeliveryDate()}</strong>
        </p>

        {/* Cart Action Button */}
        {!isInCart ? (
          <button
            className="product-cart-btn"
            onClick={handleAddToCart}
            style={addedAnim ? { background: "var(--brand-accent)", color: "#fff" } : {}}
          >
            {addedAnim ? "✓ Added to Cart!" : "🛒 Add to Cart"}
          </button>
        ) : (
          <button
            className="product-cart-btn in-cart"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/cart");
            }}
          >
            ✓ In Cart — View
          </button>
        )}
      </div>
    </div>
  );
}
