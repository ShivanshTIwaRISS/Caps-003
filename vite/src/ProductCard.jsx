import React from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "./CartContext"; // ✅ enable cart context

export default function ProductCard({ product, onWishlistToggle }) {
  const navigate = useNavigate();
  const { addItemToCart, cartItems } = useCart();

  const user = JSON.parse(localStorage.getItem("user"));  // ⭐ check login

  const openProduct = () => navigate(`/product/${product.id}`);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    onWishlistToggle(product.id);
  };

  // ⭐ FIXED: Check using productId (backend format)
  const isInCart = cartItems.some((i) => i.productId === product.id);

  /*
  const addToCart = (e) => {
    e.stopPropagation();
    addItemToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
  };
  */

  const handleAddToCart = (e) => {
    e.stopPropagation();

    // ⭐ If NOT logged in → redirect to login
    if (!user) {
      navigate("/login");
      return;
    }

    // ⭐ Add to cart normally
    addItemToCart({
      id: product.id,          // backend expects productId
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });
  };

  return (
    <div className="product-card" onClick={openProduct}>
      <div
        className="product-img"
        style={{ backgroundImage: `url(${product.thumbnail})` }}
      >
        <button className="product-wishlist" onClick={toggleWishlist}>
          {product.isInWishlist ? "💖" : "🤍"}
        </button>
      </div>

      <div className="product-info">
        <h3>{product.title}</h3>

        <div className="product-rating">
          ⭐ {product.rating} / 5
          {product.rating >= 4.5 && (
            <span className="product-badge">Top Rated</span>
          )}
        </div>

        <p className="product-price">₹{product.price}</p>

        <p className="product-stock">In Stock</p>

        <p className="product-delivery">
          Delivery by <strong>Tuesday, June 18</strong>
        </p>

        {/* ⭐ Dynamic Cart Button with Login Protection */}
        {!isInCart ? (
          <button
            className="product-cart-btn"
            onClick={handleAddToCart}
          >
            Add to Cart
          </button>
        ) : (
          <button
            className="product-cart-btn"
            onClick={(e) => {
              e.stopPropagation();
              navigate("/cart");
            }}
            style={{
              background: "var(--brand-2)",
              color: "#000",
              fontWeight: "700",
            }}
          >
            Go to Cart
          </button>
        )}
      </div>
    </div>
  );
}
