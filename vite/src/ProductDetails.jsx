import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
// import { useCart } from "../../context/CartContext";
// import { auth } from "../../firebase";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // const { addItemToCart, clearCart } = useCart();

  useEffect(() => {
    fetch(`https://dummyjson.com/products/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load product details");
        setLoading(false);
      });
  }, [id]);

  if (loading)
    return <p className="pd-loading">Loading futuristic product...</p>;
  if (error) return <p className="pd-error">{error}</p>;
  if (!product) return <p className="pd-error">Product not found</p>;

  return (
    <div className="pd-container">
      <Link to="/products" className="pd-back">
        ← Back to Products
      </Link>

      <div className="pd-grid">
        {/* LEFT: PRODUCT IMAGE */}
        <div className="pd-image-box">
          <img src={product.thumbnail} alt={product.title} />
        </div>

        {/* RIGHT: PRODUCT INFO */}
        <div className="pd-info">
          <h1 className="pd-title">{product.title}</h1>

          <p className="pd-price">${product.price}</p>
          <p className="pd-rating">⭐ {product.rating} / 5</p>

          <p className="pd-desc">{product.description}</p>

          <div className="pd-meta">
            <p><strong>Brand:</strong> {product.brand}</p>
            <p><strong>Category:</strong> {product.category}</p>
            <p className="pd-stock">In Stock</p>
            <p className="pd-delivery">🚚 Delivery in 2–4 Days</p>
          </div>

          <div className="pd-buttons">
            {/* <button
              onClick={() =>
                addItemToCart({
                  id: product.id,
                  title: product.title,
                  price: product.price,
                  thumbnail: product.thumbnail,
                })
              }
              className="pd-cart-btn"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                const user = auth.currentUser;
                if (!user) return navigate("/login");

                clearCart();
                addItemToCart(product);
                navigate("/checkout");
              }}
              className="pd-buy-btn"
            >
              Buy Now
            </button> */}

            <button className="pd-cart-btn">
              Add to Cart
            </button>

            <button className="pd-buy-btn">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
