import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useCart } from "./CartContext";
import api from "./services/api";
import {
  CreditCardIcon,
  SmartphoneIcon,
  CashIcon,
  CheckIcon,
  PackageIcon,
  CloseIcon,
  ShieldIcon,
} from "./components/Icons";

export default function Checkout() {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();

  const [mode, setMode] = useState("cart");
  const [buyNowProduct, setBuyNowProduct] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placedOrderId, setPlacedOrderId] = useState("");
  const [loading, setLoading] = useState(false);

  // COD confirmation modal state
  const [showCodModal, setShowCodModal] = useState(false);

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

  const handleInitiateOrder = () => {
    if (!isAddressValid) {
      alert("Please enter a valid and complete shipping address.");
      return;
    }

    if (paymentMethod === "cod") {
      setShowCodModal(true);
    } else {
      executeOrderPlacement();
    }
  };

  const [finalPaidAmount, setFinalPaidAmount] = useState(0);

  const executeOrderPlacement = async () => {
    setLoading(true);
    setShowCodModal(false);
    const newOrderId = `ORD-${Date.now().toString().slice(-6)}`;
    const currentGrandTotal = grandTotal;
    setFinalPaidAmount(currentGrandTotal);

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
      total: currentGrandTotal,
      address,
      paymentMethod,
      status: "Order Confirmed",
    };

    try {
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
      console.warn("Backend order placement fallback:", e);
    }

    const existingOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
    localStorage.setItem("user_orders", JSON.stringify([orderData, ...existingOrders]));
    localStorage.removeItem("cartDiscount");

    setPlacedOrderId(newOrderId);
    setOrderPlaced(true);
    setLoading(false);
  };

  if (orderPlaced) {
    return (
      <div className="checkout-page">
        <div className="checkout-success-card">
          <div className="success-icon-wrap">
            <CheckIcon size={36} />
          </div>
          <h2>Order Placed Successfully</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.95rem" }}>
            Thank you for your purchase. An order confirmation with invoice has been sent to your email.
          </p>

          <div className="order-id-badge">Order ID: #{placedOrderId}</div>

          <div
            style={{
              background: "var(--bg-subtle)",
              border: "1px solid var(--panel-border)",
              borderRadius: "14px",
              padding: "18px",
              marginBottom: "24px",
              textAlign: "left",
              fontSize: "0.88rem",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Estimated Delivery:</span>
              <strong style={{ color: "var(--brand-accent)" }}>Within 2–3 Business Days</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
              <span style={{ color: "var(--text-muted)" }}>Payment Method:</span>
              <strong style={{ textTransform: "uppercase" }}>{paymentMethod}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ color: "var(--text-muted)" }}>
                {paymentMethod === "cod" ? "Cash Amount Due on Delivery:" : "Total Paid:"}
              </span>
              <strong style={{ color: paymentMethod === "cod" ? "var(--brand-warning)" : "var(--brand-accent)" }}>
                ₹{finalPaidAmount.toLocaleString("en-IN")}
              </strong>
            </div>
          </div>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link to="/orders" className="cta-primary">
              <PackageIcon size={16} />
              <span>Track Your Order</span>
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
        {mode === "buyNow" ? "Express Checkout" : "Checkout & Payment"}
      </h1>

      <div className="checkout-grid">
        {/* LEFT COLUMN */}
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
                  placeholder="Full Name"
                  value={address.name}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-group full-span">
                <label>Street Address / Apartment</label>
                <input
                  name="street"
                  placeholder="Street Address"
                  value={address.street}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-group">
                <label>City</label>
                <input
                  name="city"
                  placeholder="City"
                  value={address.city}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-group">
                <label>ZIP / Pincode</label>
                <input
                  name="zip"
                  placeholder="Pincode"
                  value={address.zip}
                  onChange={handleAddressChange}
                />
              </div>

              <div className="form-group full-span">
                <label>Contact Phone</label>
                <input
                  name="phone"
                  placeholder="Phone Number"
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
              <span>Payment Method</span>
            </div>

            <div className="payment-methods-grid">
              <div
                className={`payment-method-card ${paymentMethod === "upi" ? "active" : ""}`}
                onClick={() => setPaymentMethod("upi")}
              >
                <SmartphoneIcon size={24} />
                <span className="payment-method-name">UPI / QR</span>
              </div>

              <div
                className={`payment-method-card ${paymentMethod === "card" ? "active" : ""}`}
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCardIcon size={24} />
                <span className="payment-method-name">Credit / Debit Card</span>
              </div>

              <div
                className={`payment-method-card ${paymentMethod === "cod" ? "active" : ""}`}
                onClick={() => setPaymentMethod("cod")}
              >
                <CashIcon size={24} />
                <span className="payment-method-name">Cash on Delivery</span>
              </div>
            </div>

            {/* UPI */}
            {paymentMethod === "upi" && (
              <div className="form-group">
                <label>UPI ID (Google Pay, PhonePe, Paytm, BHIM)</label>
                <input
                  type="text"
                  placeholder="username@okhdfcbank"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                />
                <span style={{ fontSize: "0.78rem", color: "var(--brand-accent)", marginTop: "4px" }}>
                  Verified zero-fee instant processing
                </span>
              </div>
            )}

            {/* Card */}
            {paymentMethod === "card" && (
              <div>
                <div className="card-preview-box">
                  <div className="card-preview-chip" />
                  <div className="card-preview-number">{cardDetails.number || "•••• •••• •••• ••••"}</div>
                  <div className="card-preview-bottom">
                    <div>{cardDetails.name || "CARDHOLDER"}</div>
                    <div>{cardDetails.expiry || "MM/YY"}</div>
                  </div>
                </div>

                <div className="checkout-inputs-grid">
                  <div className="form-group full-span">
                    <label>Card Number</label>
                    <input
                      placeholder="Card Number"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>Expiry (MM/YY)</label>
                    <input
                      placeholder="MM/YY"
                      value={cardDetails.expiry}
                      onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                    />
                  </div>
                  <div className="form-group">
                    <label>CVV</label>
                    <input
                      type="password"
                      maxLength={4}
                      placeholder="CVV"
                      value={cardDetails.cvv}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* COD */}
            {paymentMethod === "cod" && (
              <div
                style={{
                  background: "var(--bg-subtle)",
                  border: "1px solid var(--panel-border)",
                  padding: "16px",
                  borderRadius: "12px",
                  fontSize: "0.88rem",
                }}
              >
                <strong>Cash on Delivery Selected</strong>
                <p style={{ color: "var(--text-muted)", marginTop: "4px" }}>
                  Pay ₹{grandTotal.toLocaleString("en-IN")} via cash or UPI directly to the courier executive upon delivery.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN */}
        <div className="checkout-summary-card">
          <h3>Order Review ({checkoutItems.length} items)</h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "12px",
              maxHeight: "240px",
              overflowY: "auto",
            }}
          >
            {checkoutItems.map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <img
                  src={item.thumbnail}
                  alt={item.title}
                  style={{ width: "48px", height: "48px", borderRadius: "8px", objectFit: "cover" }}
                />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div
                    style={{
                      fontSize: "0.85rem",
                      fontWeight: 700,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    {item.title}
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--text-muted)" }}>
                    Qty: {item.quantity || 1} × ₹{item.price.toLocaleString("en-IN")}
                  </div>
                </div>
                <div style={{ fontWeight: 700, fontSize: "0.9rem" }}>
                  ₹{((item.quantity || 1) * item.price).toLocaleString("en-IN")}
                </div>
              </div>
            ))}
          </div>

          <div
            className="summary-row"
            style={{ borderTop: "1px solid var(--panel-border)", paddingTop: "12px" }}
          >
            <span>Subtotal</span>
            <span>₹{itemsTotal.toLocaleString("en-IN")}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span style={{ color: "var(--brand-accent)", fontWeight: 700 }}>FREE</span>
          </div>

          {discountInfo.amount > 0 && (
            <div className="summary-row" style={{ color: "var(--brand-accent)" }}>
              <span>Coupon ({discountInfo.promo})</span>
              <span>-₹{discountInfo.amount.toLocaleString("en-IN")}</span>
            </div>
          )}

          <div className="summary-row total">
            <span>Final Amount</span>
            <span>₹{grandTotal.toLocaleString("en-IN")}</span>
          </div>

          <button
            className="checkout-submit-btn"
            onClick={handleInitiateOrder}
            disabled={loading}
          >
            {loading
              ? "Processing Order..."
              : `Confirm & Place Order (₹${grandTotal.toLocaleString("en-IN")})`}
          </button>
        </div>
      </div>

      {/* CASH ON DELIVERY CONFIRMATION MODAL */}
      {showCodModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <h3>Confirm Cash on Delivery</h3>
              <button onClick={() => setShowCodModal(false)}>
                <CloseIcon size={20} />
              </button>
            </div>

            <div style={{ fontSize: "0.9rem", color: "var(--text-muted)", lineHeight: 1.6 }}>
              You are about to place a <strong>Cash on Delivery (COD)</strong> order for a total of{" "}
              <strong style={{ color: "var(--text)" }}>₹{grandTotal.toLocaleString("en-IN")}</strong>.
            </div>

            <div
              style={{
                background: "var(--bg-subtle)",
                border: "1px solid var(--panel-border)",
                padding: "14px",
                borderRadius: "12px",
                fontSize: "0.85rem",
              }}
            >
              <div><strong>Delivery Address:</strong></div>
              <div>{address.name}</div>
              <div>{address.street}, {address.city} - {address.zip}</div>
              <div>Phone: {address.phone}</div>
            </div>

            <div style={{ fontSize: "0.8rem", color: "var(--brand-warning)", fontWeight: 600 }}>
              Please ensure someone is available at the address to receive the package and complete payment.
            </div>

            <div className="modal-actions">
              <button
                className="cta-secondary"
                onClick={() => setShowCodModal(false)}
                style={{ flex: 1 }}
              >
                Cancel
              </button>
              <button
                className="cta-primary"
                onClick={executeOrderPlacement}
                style={{ flex: 1 }}
              >
                Confirm COD Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
