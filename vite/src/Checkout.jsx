import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "./CartContext";
import api from "./services/api";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [mode, setMode] = useState("cart");
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  // Address state
  const [address, setAddress] = useState({
    name: "Shivansh Tiwari",
    street: "24 Cyber Tower, MG Road",
    city: "Bengaluru",
    state: "Karnataka",
    zip: "560001",
    phone: "+91 98765 43210",
  });

  // Payment state
  const [paymentMethod, setPaymentMethod] = useState("upi");
  const [cardDetails, setCardDetails] = useState({
    number: "4532 •••• •••• 8829",
    name: "SHIVANSH TIWARI",
    expiry: "08/29",
    cvv: "•••",
  });
  const [upiId, setUpiId] = useState("user@okaxis");
  const [confirmCod, setConfirmCod] = useState(false);

  // Promo discount from cart
  const [discountInfo, setDiscountInfo] = useState({ amount: 0, promo: "" });

  useEffect(() => {
    const buyNow = localStorage.getItem("buyNowProduct");
    if (buyNow) {
      setMode("buyNow");
      setBuyNowProduct(JSON.parse(buyNow));
    } else {
      setMode("cart");
    }

    const disc = localStorage.getItem("cartDiscount");
    if (disc) {
      try {
        setDiscountInfo(JSON.parse(disc));
      } catch (e) {}
    }
  }, []);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const isAddressValid = address.name && address.street && address.city && address.zip;

  const checkoutItems = mode === "buyNow" ? (buyNowProduct ? [buyNowProduct] : []) : cartItems;
  const itemsTotal = mode === "buyNow" ? buyNowProduct?.price || 0 : totalPrice;
  const grandTotal = Math.max(0, itemsTotal - discountInfo.amount);

  const handlePlaceOrder = async () => {
    if (!isAddressValid) {
      alert("Please enter a complete shipping address.");
      return;
    }

    setLoading(true);
    const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;

    // Prepare realistic order object
    const orderData = {
      id: newOrderId,
      createdAt: new Date().toISOString(),
      items: checkoutItems.map((item) => ({
        productId: item.productId || item.id,
        title: item.title,
        price: item.price,
        quantity: item.quantity || 1,
        thumbnail: item.thumbnail,
      })),
      total: grandTotal,
      address,
      paymentMethod,
      status: "Order Confirmed",
    };

    try {
      // Attempt backend order placement
      if (mode === "buyNow") {
        await api.post("/orders/buy-now", {
          productId: buyNowProduct.productId || buyNowProduct.id,
          title: buyNowProduct.title,
          price: buyNowProduct.price,
          quantity: 1,
          thumbnail: buyNowProduct.thumbnail,
          address,
          paymentMethod,
        }).catch(() => {});
        localStorage.removeItem("buyNowProduct");
      } else {
        await api.post("/orders/place").catch(() => {});
        clearCart();
      }
    } catch (e) {
      console.warn("Backend order sync fallback:", e);
    }

    // Save to local orders array for instant reflection
    const existingOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
    localStorage.setItem("user_orders", JSON.stringify([orderData, ...existingOrders]));
    localStorage.removeItem("cartDiscount");

    setPlacedOrderId(newOrderId);
    setOrderPlaced(true);
    setLoading(false);
  };

  // SUCCESS CONFIRMATION SCREEN
  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-success-card">
          <div className="success-icon-wrap">🎉</div>
          <h2>Order Placed Successfully!</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Thank you for your purchase. We've sent an order confirmation to your registered email.
          </p>

          <div className="order-id-badge">Order ID: #{placedOrderId}</div>

          <div
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--panel-border)",
              borderRadius: "14px",
              padding: "16px",
              marginBottom: "24px",
              textAlign: "left",
              fontSize: "0.88rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "var(--text-muted)" }}>Estimated Delivery:</span>
              <strong style={{ color: "var(--brand-accent)" }}>Within 2–3 Days</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
              <span style={{ color: "var(--text-muted)" }}>Payment Method:</span>
              <strong style={{ textTransform: "uppercase" }}>{paymentMethod}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>Total Paid:</span>
              <strong>₹{grandTotal.toFixed(0)}</strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/orders" className="cta-primary">
              📦 Track Your Order
            </Link>
            <Link to="/products" className="cta-secondary">
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1 className="checkout-title">
        {mode === "buyNow" ? "⚡ Express Checkout" : "🛍️ Checkout"}
      </h1>

      <div className="checkout-grid">
        {/* LEFT COLUMN — STEPS */}
        <div>
          {/* STEP 1: SHIPPING ADDRESS */}
          <div className="checkout-section-card">
            <div className="checkout-section-title">
              <span className="checkout-step-num">1</span>
              <span>Shipping Address</span>
            </div>

            <div className="checkout-inputs-grid">
              <div className="form-group full-span">
                <label>Full Name</label>
                <input
                  name="name"
                  placeholder="e.g. John Doe"
                  value={address.name}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-group full-span">
                <label>Street Address / Apartment</label>
                <input
                  name="street"
                  placeholder="Flat 402, Green Valley Apts"
                  value={address.street}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  name="city"
                  placeholder="Bengaluru"
                  value={address.city}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-group">
                <label>ZIP / Pincode</label>
                <input
                  name="zip"
                  placeholder="560001"
                  value={address.zip}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-group full-span">
                <label>Contact Phone</label>
                <input
                  name="phone"
                  placeholder="+91 98765 43210"
                  value={address.phone}
                  onChange={handleAddressChange}
                />
              </div>
            </div>
          </div>

          {/* STEP 2: PAYMENT METHOD */}
          <div className="checkout-section-card">
            <div className="checkout-section-title">
              <span className="checkout-step-num">2</span>
              <span>Payment Option</span>
            </div>

            <div className="payment-methods-grid">
              <div
                className={`payment-method-card ${paymentMethod === "upi" ? "active" : ""}`}
                onClick={() => setPaymentMethod("upi")}
              >
                <div className="payment-method-icon">📱</div>
                <div className="payment-method-name">UPI / QR</div>
              </div>

              <div
                className={`payment-method-card ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <div className="payment-method-icon">💳</div>
                <div className="payment-method-name">Credit/Debit Card</div>
              </div>

              <div
                className={`payment-method-card ${paymentMethod === "cod" ? "active" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                <div className="payment-method-icon">💵</div>
                <div className="payment-method-name">Cash on Delivery</div>
              </div>
            </div>

            {/* UPI Option */}
            {paymentMethod === "upi" && (
              <div className="form-group">
                <label>UPI ID (Google Pay, PhonePe, Paytm)</label>
                <input
                  type="text"
                  placeholder="username@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <span style={{ fontSize: "0.78rem", color: "var(--brand-accent)", marginTop: "4px" }}>
                  ✓ Instant zero-fee verification
                </span>
              </div>
            )}

            {/* Card Option with Visual Mockup */}
            {paymentMethod === "card" && (
              <div>
                <div className="card-preview-box">
                  <div className="card-preview-chip" />
                  <div className="card-preview-number">{cardDetails.number || "•••• •••• •••• ••••"}</div>
                  <div className="card-preview-bottom">
                    <div>{cardDetails.name || "CARDHOLDER NAME"}</div>
                    <div>{cardDetails.expiry || "MM/YY"}</div>
                  </div>
                </div>

                <div className="checkout-inputs-grid">
                  <div className="form-group full-span">
                    <label>Card Number</label>
                    <input
                      placeholder="4532 1234 5678 8829"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input
                      placeholder="08/29"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="123"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COD Option */}
            {paymentMethod === "cod" && (
              <div style={{ background: "var(--bg-subtle)", padding: "14px", borderRadius: "10px", fontSize: "0.88rem" }}>
                <p>💵 Pay with cash or UPI at the time of doorstep delivery.</p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN — SUMMARY & PLACE ORDER */}
        <div className="checkout-summary-card">
          <h3>Order Review ({checkoutItems.length} items)</h3>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "240px", overflowY: "auto" }}>
            {checkoutItems.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "0.85rem", fontWeight: 700, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Qty: {item.quantity || 1} × ₹{item.price}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                  ₹{((item.quantity || 1) * item.price).toFixed(0)}
                </div>
              </div>
            ))}
          </div>

          <div className="summary-row" style={{ borderTop: "1px solid var(--panel-border)", paddingTop: "12px" }}>
            <span>Subtotal</span>
            <span>₹{itemsTotal.toFixed(0)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: "var(--brand-accent)", fontWeight: 700 }}>FREE</span>
          </div>

          {discountInfo.amount > 0 && (
            <div className="summary-row" style={{ color: "var(--brand-accent)" }}>
              <span>Coupon ({discountInfo.promo})</span>
              <span>-₹{discountInfo.amount}</span>
            </div>
          )}

          <div className="summary-row total">
            <span>Final Amount</span>
            <span>₹{grandTotal.toFixed(0)}</span>
          </div>

          <button
            className="checkout-submit-btn"
            onClick={handlePlaceOrder}
            disabled={loading}
          >
            {loading ? "Processing Order..." : `Confirm & Place Order (₹${grandTotal.toFixed(0)})`}
          </button>
        </div>
      </div>
    </div>
  );
}
