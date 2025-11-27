import React, { useState } from "react";
import { useCart } from "./CartContext";
import api from "./services/api"; // ⭐ use your axios instance

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [address, setAddress] = useState({
    name: "",
    street: "",
    city: "",
    zip: "",
  });

  const [paymentMethod, setPaymentMethod] = useState("");
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvv: "",
  });
  const [upiId, setUpiId] = useState("");
  const [confirmCod, setConfirmCod] = useState(false);

  const token = localStorage.getItem("accessToken");

  const handleChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  const isAddressValid =
    address.name && address.street && address.city && address.zip;

  const isPaymentValid =
    (paymentMethod === "card" &&
      cardDetails.number &&
      cardDetails.expiry &&
      cardDetails.cvv) ||
    (paymentMethod === "upi" && upiId) ||
    paymentMethod === "cod";

  const handlePlaceOrder = async () => {
    if (!isAddressValid || !isPaymentValid) return;

    if (paymentMethod === "cod" && !confirmCod) {
      alert("Please confirm your Cash on Delivery order.");
      setConfirmCod(true);
      return;
    }

    // ---------------- ORIGINAL FIREBASE CODE (KEPT) ----------------
    /*
    await addDoc(collection(db, "orders"), {
      userId: auth.currentUser.uid,
      items: cartItems,
      total: totalPrice,
      address,
      paymentMethod,
      createdAt: serverTimestamp(),
    });

    clearCart();
    */
    // ---------------------------------------------------------------

    // ⭐ BACKEND ORDER API CALL
    try {
      const res = await api.post("/orders/place");

      console.log("ORDER PLACED:", res.data);

      clearCart(); // ⭐ Clear cart locally
      setOrderPlaced(true); // 🎉 Show success screen
    } catch (err) {
      console.error("❌ Order error:", err);
      alert("Failed to place order. Try again.");
    }
  };

  // ========== SUCCESS SCREEN ==========
  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <h2>🎉 Order Placed Successfully!</h2>
        <p>Thank you for shopping with us.</p>
      </div>
    );
  }

  // ========== MAIN CHECKOUT PAGE ==========
  return (
    <div className="checkout-page">
      <h2 className="checkout-title">Checkout</h2>

      <div className="checkout-grid">

        {/* Address */}
        <div className="checkout-section">
          <h3>Shipping Address</h3>
          <input name="name" placeholder="Full Name" value={address.name} onChange={handleChange} />
          <input name="street" placeholder="Street Address" value={address.street} onChange={handleChange} />
          <input name="city" placeholder="City" value={address.city} onChange={handleChange} />
          <input name="zip" placeholder="ZIP Code" value={address.zip} onChange={handleChange} />
        </div>

        {/* Order Summary */}
        <div className="checkout-section">
          <h3>Order Summary</h3>

          {cartItems.length === 0 ? (
            <p className="empty-cart">Your cart is empty.</p>
          ) : (
            cartItems.map((item) => (
              <div key={item.id} className="summary-item">
                <img src={item.thumbnail} alt={item.title} />
                <div>
                  <p>{item.title}</p>
                  <p>Qty: {item.quantity}</p>
                  <p>₹{(item.price * item.quantity).toFixed(2)}</p>
                </div>
              </div>
            ))
          )}

          <h4 className="summary-total">
            Total: ₹{totalPrice.toFixed(2)}
          </h4>
        </div>

        {/* Payment */}
        <div className="checkout-section">
          <h3>Payment Method</h3>

          <select
            className="checkout-select"
            value={paymentMethod}
            onChange={(e) => {
              setPaymentMethod(e.target.value);
              setConfirmCod(false);
            }}
          >
            <option value="">Select Payment Method</option>
            <option value="card">Credit/Debit Card</option>
            <option value="upi">UPI</option>
            <option value="cod">Cash on Delivery</option>
          </select>

          {paymentMethod === "card" && (
            <>
              <input placeholder="Card Number" value={cardDetails.number}
                onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} />

              <input placeholder="Expiry Date (MM/YY)" value={cardDetails.expiry}
                onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} />

              <input placeholder="CVV" value={cardDetails.cvv}
                onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} />
            </>
          )}

          {paymentMethod === "upi" && (
            <input placeholder="Enter UPI ID" value={upiId}
              onChange={(e) => setUpiId(e.target.value)} />
          )}

          {paymentMethod === "cod" && confirmCod && (
            <p className="cod-confirm">✅ COD Confirmed</p>
          )}
        </div>

        {/* Place Order */}
        <div className="checkout-section">
          <button
            className="checkout-btn"
            onClick={handlePlaceOrder}
            disabled={!isAddressValid || !isPaymentValid}
          >
            Place Order
          </button>

          {(!isAddressValid || !isPaymentValid) && (
            <p className="checkout-warning">
              Please complete address & payment details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
