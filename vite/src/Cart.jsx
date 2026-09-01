import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

export default function Cart() {
  const {
    cartItems,
    removeItemFromCart,
    clearCart,
    updateItemQuantity,
    totalItems,
    totalPrice,
    reloadCart,
  } = useCart();

  const navigate = useNavigate();
  const token = localStorage.getItem("accessToken");

  // Promo code system
  const [promoCode, setPromoCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [appliedPromo, setAppliedPromo] = useState("");
  const [promoError, setPromoError] = useState("");

  // Load cart on mount
  useEffect(() => {
    if (token) reloadCart();
  }, [token, reloadCart]);

  const handleApplyPromo = (e) => {
    e.preventDefault();
    const code = promoCode.trim().toUpperCase();
    setPromoError("");

    if (code === "SAVE20") {
      const disc = Math.round(totalPrice * 0.2);
      setDiscountAmount(disc);
      setAppliedPromo("SAVE20 (20% OFF)");
    } else if (code === "WELCOME50") {
      const disc = Math.min(50, totalPrice);
      setDiscountAmount(disc);
      setAppliedPromo("WELCOME50 (₹50 OFF)");
    } else if (code === "CYBER10") {
      const disc = Math.round(totalPrice * 0.1);
      setDiscountAmount(disc);
      setAppliedPromo("CYBER10 (10% OFF)");
    } else {
      setPromoError("Invalid promo code. Try SAVE20 or WELCOME50");
      setDiscountAmount(0);
      setAppliedPromo("");
    }
  };

  const handleCheckout = () => {
    localStorage.removeItem("buyNowProduct");
    // Save discount info for checkout
    localStorage.setItem("cartDiscount", JSON.stringify({ amount: discountAmount, promo: appliedPromo }));
    navigate("/checkout");
  };

  const freeShippingThreshold = 999;
  const progressPercent = Math.min(100, (totalPrice / freeShippingThreshold) * 100);
  const diffToFree = Math.max(0, freeShippingThreshold - totalPrice);

  const finalTotal = Math.max(0, totalPrice - discountAmount);

  if (cartItems.length === 0) {
    return (
      <div className="cart-page">
        <div className="cart-empty">
          <span style={{ fontSize: "3.5rem", display: "block", marginBottom: "16px" }}>🛒</span>
          <h2>Your Shopping Bag is Empty</h2>
          <p>Explore our trending catalog and discover incredible cyber-grade tech!</p>
          <Link to="/products" className="cta-primary" style={{ display: "inline-flex" }}>
            Explore Products Now →
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Shopping Cart ({totalItems} items)</h1>

      {/* Free Shipping Progress Bar */}
      <div
        style={{
          background: "var(--panel)",
          border: "1px solid var(--panel-border)",
          borderRadius: "14px",
          padding: "16px 20px",
          marginBottom: "24px",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.88rem", fontWeight: 700, marginBottom: "8px" }}>
          <span>
            {diffToFree === 0
              ? "🎉 You've unlocked FREE Express Shipping!"
              : `Add ₹${diffToFree.toFixed(0)} more to unlock FREE Express Shipping`}
          </span>
          <span style={{ color: "var(--brand-accent)" }}>{Math.round(progressPercent)}%</span>
        </div>
        <div style={{ width: "100%", height: "8px", background: "var(--bg-subtle)", borderRadius: "999px", overflow: "hidden" }}>
          <div
            style={{
              width: `${progressPercent}%`,
              height: "100%",
              background: "linear-gradient(90deg, var(--brand-primary), var(--brand-accent))",
              transition: "width 0.3s ease",
            }}
          />
        </div>
      </div>

      <div className="cart-grid">
        {/* LEFT — ITEM CARDS */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.cartItemId || item.id} className="cart-item">
              <img src={item.thumbnail} alt={item.title} />

              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p className="cart-price">₹{item.price}</p>

                <div className="cart-qty-row">
                  <div className="cart-qty-selector">
                    <button
                      onClick={() => {
                        if (item.quantity === 1) {
                          removeItemFromCart(item.cartItemId || item.id);
                        } else {
                          updateItemQuantity(item.cartItemId || item.id, item.quantity - 1);
                        }
                      }}
                    >
                      −
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() =>
                        updateItemQuantity(item.cartItemId || item.id, item.quantity + 1)
                      }
                    >
                      +
                    </button>
                  </div>

                  <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginLeft: "8px" }}>
                    Subtotal: <strong>₹{(item.price * item.quantity).toFixed(0)}</strong>
                  </span>

                  <button
                    className="cart-remove-btn"
                    onClick={() => removeItemFromCart(item.cartItemId || item.id)}
                  >
                    🗑 Remove
                  </button>
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={() => {
              if (window.confirm("Are you sure you want to clear your cart?")) {
                clearCart();
              }
            }}
            style={{
              color: "var(--brand-danger)",
              fontSize: "0.85rem",
              fontWeight: 700,
              padding: "10px",
              width: "fit-content",
            }}
          >
            Clear entire cart
          </button>
        </div>

        {/* RIGHT — ORDER SUMMARY & PROMO */}
        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Items Subtotal ({totalItems})</span>
            <span>₹{totalPrice.toFixed(0)}</span>
          </div>

          <div className="summary-row">
            <span>Estimated Shipping</span>
            <span style={{ color: "var(--brand-accent)", fontWeight: 700 }}>
              {diffToFree === 0 ? "FREE" : "₹49"}
            </span>
          </div>

          {discountAmount > 0 && (
            <div className="summary-row" style={{ color: "var(--brand-accent)" }}>
              <span>Promo Discount ({appliedPromo})</span>
              <span>-₹{discountAmount}</span>
            </div>
          )}

          {/* Promo Code Input */}
          <form className="promo-input-group" onSubmit={handleApplyPromo}>
            <input
              type="text"
              placeholder="Promo Code (SAVE20)"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value)}
            />
            <button type="submit">Apply</button>
          </form>

          {promoError && (
            <div style={{ fontSize: "0.78rem", color: "var(--brand-danger)" }}>
              {promoError}
            </div>
          )}

          {appliedPromo && (
            <div style={{ fontSize: "0.8rem", color: "var(--brand-accent)", fontWeight: 700 }}>
              ✓ Coupon applied successfully!
            </div>
          )}

          <div className="summary-row total">
            <span>Estimated Total</span>
            <span>₹{finalTotal.toFixed(0)}</span>
          </div>

          <button onClick={handleCheckout} className="cart-checkout-btn">
            Proceed to Checkout →
          </button>

          <div style={{ textAlign: "center", fontSize: "0.78rem", color: "var(--text-dim)", marginTop: "4px" }}>
            🔒 Safe and secure 256-Bit SSL encrypted checkout
          </div>
        </div>
      </div>
    </div>
  );
}
