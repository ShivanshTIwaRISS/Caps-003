import React, { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import api from "./services/api";

export default function Checkout() {
  const { cartItems, totalPrice, clearCart } = useCart();

  const [orderPlaced, setOrderPlaced] = useState(false);

  const [mode, setMode] = useState("cart"); 

  const [buyNowProduct, setBuyNowProduct] = useState(null);

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

  // ⭐ Detect if this checkout is Buy Now
  useEffect(() => {
    const product = localStorage.getItem("buyNowProduct");

    if (product) {
      setMode("buyNow");
      setBuyNowProduct(JSON.parse(product));
    } else {
      setMode("cart");
    }
  }, []);

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

    try {
      let res;

      if (mode === "buyNow") {
        // ⭐ BUY NOW MODE → do NOT clear cart
        res = await api.post("/orders/buy-now", {
          productId: buyNowProduct.productId || buyNowProduct.id,
          title: buyNowProduct.title,
          price: buyNowProduct.price,
          quantity: 1,
          thumbnail: buyNowProduct.thumbnail,
          address,
          paymentMethod,
        });

        // remove buy-now cache
        localStorage.removeItem("buyNowProduct");
      } else {
        // ⭐ CART CHECKOUT MODE → clear entire cart
        res = await api.post("/orders/place");

        clearCart();
      }

      console.log("ORDER PLACED:", res.data);
      setOrderPlaced(true);

    } catch (err) {
      console.error("❌ Order error:", err);
      alert("Failed to place order. Try again.");
    }
  };

  // ========== SUCCESS ==========
  if (orderPlaced) {
    return (
      <div className="checkout-success">
        <h2>🎉 Order Placed Successfully!</h2>
        <p>Thank you for shopping with us.</p>
      </div>
    );
  }

  // ⭐ Determine items to display
  const checkoutItems = mode === "buyNow" ? [buyNowProduct] : cartItems;
  const checkoutTotal =
    mode === "buyNow"
      ? buyNowProduct?.price || 0
      : totalPrice;

  // ========== MAIN CHECKOUT PAGE ==========
  return (
    <div className="checkout-page">
      <h2 className="checkout-title">
        Checkout ({mode === "buyNow" ? "Buy Now" : "Cart Checkout"})
      </h2>

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

          {checkoutItems.map((item, index) => (
            <div key={index} className="summary-item">
              <img src={item.thumbnail} alt={item.title} />
              <div>
                <p>{item.title}</p>
                <p>Qty: {mode === "buyNow" ? 1 : item.quantity}</p>
                <p>₹{(item.price * (item.quantity || 1)).toFixed(2)}</p>
              </div>
            </div>
          ))}

          <h4 className="summary-total">
            Total: ₹{checkoutTotal.toFixed(2)}
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
