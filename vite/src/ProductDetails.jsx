import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { useWishlist } from "./WishlistContext";
import { getProductById, getProducts } from "./services/productService";
import ProductCard from "./ProductCard";
import {
  ArrowLeftIcon,
  CheckIcon,
  StarIcon,
  CartIcon,
  TruckIcon,
  ShieldIcon,
  PackageIcon,
  HeartIcon,
} from "./components/Icons";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addItemToCart, cartItems } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [addedToast, setAddedToast] = useState(false);

  const [pincode, setPincode] = useState("");
  const [pincodeResult, setPincodeResult] = useState(null);

  const user = localStorage.getItem("user");

  const isInCart = cartItems.some(
    (i) => i.productId === Number(id) || i.id === Number(id)
  );

  const isWishlisted = product ? isInWishlist(product.id) : false;

  useEffect(() => {
    let isCurrent = true;
    setLoading(true);
    setError(null);
    window.scrollTo({ top: 0, behavior: "smooth" });

    async function loadProduct() {
      try {
        const data = await getProductById(id);
        if (isCurrent) {
          setProduct(data);
          setActiveImage(data.images && data.images.length > 0 ? data.images[0] : data.thumbnail);
          setLoading(false);

          if (data.category) {
            const rel = await getProducts({ category: data.category, limit: 4 });
            if (isCurrent) {
              setRelatedProducts(
                (rel.products || []).filter((p) => p.id !== Number(id)).slice(0, 3)
              );
            }
          }
        }
      } catch (err) {
        if (isCurrent) {
          setError("Product not found or network issue.");
          setLoading(false);
        }
      }
    }

    loadProduct();
    return () => {
      isCurrent = false;
    };
  }, [id]);

  const handlePincodeCheck = (e) => {
    e.preventDefault();
    if (!pincode || pincode.length < 5) {
      setPincodeResult("Please enter a valid 6-digit pincode.");
      return;
    }
    const d = new Date();
    d.setDate(d.getDate() + 2);
    const dateStr = d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
    setPincodeResult(`Delivery available to ${pincode} by ${dateStr} (Free Express Shipping)`);
  };

  const handleAddToCart = () => {
    if (!user) return navigate("/login");

    addItemToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      thumbnail: product.thumbnail,
    });

    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    if (!user) return navigate("/login");

    localStorage.setItem(
      "buyNowProduct",
      JSON.stringify({
        productId: product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        quantity: 1,
      })
    );
    navigate("/checkout");
  };

  if (loading) {
    return (
      <div className="pd-container">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1.15fr", gap: "40px" }}>
          <div className="skeleton" style={{ height: "440px", borderRadius: "20px" }} />
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div className="skeleton" style={{ height: "30px", width: "40%" }} />
            <div className="skeleton" style={{ height: "60px", width: "80%" }} />
            <div className="skeleton" style={{ height: "40px", width: "50%" }} />
            <div className="skeleton" style={{ height: "120px" }} />
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="pd-container" style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2>Product Not Found</h2>
        <p style={{ color: "var(--text-muted)", margin: "12px 0 24px" }}>
          The product you are looking for is unavailable or discontinued.
        </p>
        <Link to="/products" className="cta-primary">
          <ArrowLeftIcon size={16} />
          <span>Back to Catalog</span>
        </Link>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images.slice(0, 5)
      : [product.thumbnail];

  return (
    <div className="pd-container">
      {/* Toast Notification */}
      {addedToast && (
        <div
          style={{
            position: "fixed",
            bottom: "24px",
            right: "24px",
            background: "var(--brand-accent)",
            color: "#fff",
            padding: "12px 24px",
            borderRadius: "12px",
            fontWeight: 700,
            boxShadow: "var(--shadow-lg)",
            zIndex: 1000,
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
        >
          <CheckIcon size={18} />
          <span>Added {product.title} to your bag</span>
        </div>
      )}

      {/* Breadcrumb */}
      <Link to="/products" className="pd-back-link">
        <ArrowLeftIcon size={16} />
        <span>Back to All Products</span>
      </Link>

      <div className="pd-grid">
        {/* GALLERY */}
        <div className="pd-gallery">
          <div className="pd-main-image-wrap">
            <img
              src={activeImage || product.thumbnail}
              alt={product.title}
              className="pd-main-image"
            />
          </div>

          {galleryImages.length > 1 && (
            <div className="pd-thumbs-row">
              {galleryImages.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`thumbnail ${idx}`}
                  className={`pd-thumb ${activeImage === img ? "active" : ""}`}
                  onClick={() => setActiveImage(img)}
                />
              ))}
            </div>
          )}
        </div>

        {/* DETAILS */}
        <div className="pd-info">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span className="pd-brand-tag">{product.brand || product.category || "OS Choice"}</span>
            <button
              onClick={() => toggleWishlist(product)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 14px",
                borderRadius: "999px",
                background: isWishlisted ? "rgba(239, 68, 68, 0.15)" : "var(--bg-subtle)",
                color: isWishlisted ? "var(--brand-danger)" : "var(--text-muted)",
                border: "1px solid var(--panel-border)",
                fontWeight: 700,
                fontSize: "0.84rem",
              }}
            >
              <HeartIcon size={16} filled={isWishlisted} />
              <span>{isWishlisted ? "Saved to Wishlist" : "Add to Wishlist"}</span>
            </button>
          </div>

          <h1 className="pd-title">{product.title}</h1>

          {/* Rating */}
          <div className="pd-rating-block">
            <div className="pd-rating-pill">
              <StarIcon size={14} filled={true} />
              <span>{product.rating} / 5</span>
            </div>
            <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
              Based on {product.reviewsCount || 48} verified customer reviews
            </span>
          </div>

          {/* Price Card */}
          <div className="pd-price-card">
            <span className="pd-current-price">₹{product.price.toLocaleString("en-IN")}</span>
            {product.originalPrice && (
              <span className="pd-original-price">
                ₹{product.originalPrice.toLocaleString("en-IN")}
              </span>
            )}
            {product.discountPercentage > 0 && (
              <span className="pd-save-badge">
                Save ₹{(product.originalPrice - product.price).toLocaleString("en-IN")} ({product.discountPercentage}% OFF)
              </span>
            )}
          </div>

          <p className="pd-desc">{product.description}</p>

          {/* Specifications Box */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(2, 1fr)",
              gap: "12px",
              background: "var(--panel)",
              border: "1px solid var(--panel-border)",
              borderRadius: "14px",
              padding: "16px",
              fontSize: "0.86rem",
            }}
          >
            <div>
              <span style={{ color: "var(--text-muted)" }}>Stock Status: </span>
              <strong style={{ color: "var(--brand-accent)" }}>
                In Stock ({product.stock} units available)
              </strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Warranty: </span>
              <strong>{product.warranty}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Return Policy: </span>
              <strong>{product.returnPolicy}</strong>
            </div>
            <div>
              <span style={{ color: "var(--text-muted)" }}>Shipping: </span>
              <strong>Free Express</strong>
            </div>
          </div>

          {/* Pincode Estimator */}
          <div className="pd-delivery-box">
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: 700, fontSize: "0.9rem" }}>
              <TruckIcon size={18} />
              <span>Check Delivery & COD Availability</span>
            </div>
            <form className="pd-pincode-form" onSubmit={handlePincodeCheck}>
              <input
                type="text"
                placeholder="Enter 6-digit Pincode"
                value={pincode}
                maxLength={6}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, ""))}
              />
              <button type="submit">Verify</button>
            </form>
            {pincodeResult && (
              <div className="pd-pincode-result" style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <CheckIcon size={16} />
                <span>{pincodeResult}</span>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="pd-actions">
            {!isInCart ? (
              <button className="pd-add-btn" onClick={handleAddToCart}>
                <CartIcon size={18} />
                <span>Add to Cart</span>
              </button>
            ) : (
              <button
                className="pd-add-btn"
                onClick={() => navigate("/cart")}
                style={{ background: "var(--brand-accent)", color: "#fff", borderColor: "var(--brand-accent)" }}
              >
                <CheckIcon size={18} />
                <span>In Cart — View Bag</span>
              </button>
            )}

            <button className="pd-buy-btn" onClick={handleBuyNow}>
              <PackageIcon size={18} />
              <span>Instant Buy Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* CUSTOMER REVIEWS */}
      <section className="pd-reviews-section">
        <h3 className="pd-reviews-head">Verified Customer Reviews</h3>

        <div className="pd-reviews-grid">
          {product.reviews.map((rev, i) => (
            <div key={i} className="review-card">
              <div className="review-user-row">
                <div className="review-avatar">
                  {rev.reviewerName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="review-name">{rev.reviewerName}</div>
                  <div className="verified-badge">
                    <CheckIcon size={14} />
                    <span>Verified Purchase</span>
                  </div>
                </div>
                <div style={{ marginLeft: "auto", display: "flex", gap: "2px", color: "var(--brand-warning)" }}>
                  {Array.from({ length: rev.rating || 5 }).map((_, starIdx) => (
                    <StarIcon key={starIdx} size={14} filled={true} />
                  ))}
                </div>
              </div>
              <p className="review-comment">"{rev.comment}"</p>
            </div>
          ))}
        </div>
      </section>

      {/* RELATED PRODUCTS */}
      {relatedProducts.length > 0 && (
        <section style={{ marginTop: "56px" }}>
          <h3 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "20px" }}>
            Recommended Accessories & Similar Items
          </h3>
          <div className="products-grid">
            {relatedProducts.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
