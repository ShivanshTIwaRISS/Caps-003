import React from "react";
import { useNavigate } from "react-router-dom";
// import { useCart } from "../../context/CartContext";

export default function ProductCard({ product, onWishlistToggle }) {
  const navigate = useNavigate();

  const openProduct = () => navigate(`/products/${product.id}`);

  const toggleWishlist = (e) => {
    e.stopPropagation();
    onWishlistToggle(product.id);
  };

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

        <p className="product-price">₹{product.price * 10}</p>

        <p className="product-stock">In Stock</p>

        <p className="product-delivery">
          Delivery by <strong>Tuesday, June 18</strong>
        </p>

        {/*
        <button className="product-cart-btn" onClick={addToCart}>
          Add to Cart
        </button>
        */}
      </div>
    </div>
  );
}
