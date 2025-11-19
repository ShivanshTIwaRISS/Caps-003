import React from "react";
import { useNavigate } from "react-router-dom";
// import { useCart } from "./CartContext";

export default function ProductCard({ product, onWishlistToggle }) {
  const navigate = useNavigate();
  // const { addItemToCart } = useCart();

  const handleWishlistClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    onWishlistToggle(product.id);
  };

  // const handleAddToCart = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   addItemToCart({
  //     id: product.id,
  //     title: product.title,
  //     price: product.price,
  //     thumbnail: product.thumbnail,
  //   });
  //   alert("Added to cart!");
  // };

  const handleCardClick = () => {
    navigate(`/products/${product.id}`);
  };

  return (
    <div className="card" onClick={handleCardClick}>
      <div className="imageWrapper">
        <img
          src={product.thumbnail}
          alt={product.title}
          className="image"
        />

        <button
          onClick={handleWishlistClick}
          className="wishlistButton"
          aria-label={
            product.isInWishlist
              ? "Remove from wishlist"
              : "Add to wishlist"
          }
        >
          {product.isInWishlist ? "💖" : "🤍"}
        </button>
      </div>

      <div className="info">
        <h3 className="title">{product.title}</h3>

        <div className="ratingRow">
          <p className="rating">⭐ {product.rating} / 5</p>
          {product.rating >= 4.5 && (
            <span className="badge">Top Rated</span>
          )}
        </div>

        <p className="price">${product.price}</p>
        <p className="stock">In stock</p>
        <p className="delivery">
          Get it by <strong>Tuesday, June 18</strong>
        </p>

        {/* <button className="cartButton" onClick={handleAddToCart}>
          Add to Cart
        </button> */}
      </div>
    </div>
  );
}
