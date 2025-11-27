import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { addItemToCart, cartItems, clearCart } = useCart();

  // ⭐ FIX: backend & local cart use "productId"
  const isInCart = cartItems.some((i) => i.productId === Number(id));

  const user = JSON.parse(localStorage.getItem("user"));
  const token = localStorage.getItem("accessToken");

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

  /* ⭐ BACKEND add-to-cart helper */
  const syncToBackend = async () => {
    if (!token) return;

    await fetch("https://caps-003.onrender.com/cart/add", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        productId: product.id, // 🔥 FIXED KEY
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
      }),
    });
  };

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
        <div className="pd-image-box">
          <img src={product.thumbnail} alt={product.title} />
        </div>

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

            {/* -------------------- ORIGINAL COMMENTED BLOCK (KEEPING SAFE) --------------------
              
            <button
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
            ------------------------------------------------------------------ */}

            {/* ⭐ ACTIVE BUTTON (Protected + Dynamic + Backend Synced) */}
            {!isInCart ? (
              <button
                className="pd-cart-btn"
                onClick={async () => {
                  if (!user) {
                    navigate("/login"); // ⭐ redirect if not logged in
                    return;
                  }

                  // Local cart update with correct productId
                  addItemToCart({
                    productId: product.id,
                    title: product.title,
                    price: product.price,
                    thumbnail: product.thumbnail,
                  });

                  // Backend sync
                  await syncToBackend();
                }}
              >
                Add to Cart
              </button>
            ) : (
              <button
                className="pd-cart-btn"
                onClick={() => navigate("/cart")}
                style={{ background: "var(--brand-2)", color: "#000" }}
              >
                Go to Cart
              </button>
            )}

            {/* ⭐ BUY NOW (Protected + Backend Sync) */}
            <button
              className="pd-buy-btn"
              onClick={async () => {
                if (!user) {
                  navigate("/login");
                  return;
                }

                clearCart(); // Clear local cart

                addItemToCart({
                  productId: product.id,
                  title: product.title,
                  price: product.price,
                  thumbnail: product.thumbnail,
                });

                await syncToBackend();

                navigate("/checkout");
              }}
            >
              Buy Now
            </button>

          </div>
        </div>
      </div>
    </div>
  );
}
