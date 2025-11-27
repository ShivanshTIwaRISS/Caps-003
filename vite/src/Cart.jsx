import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
// import { auth } from "../../firebase";
// import { onAuthStateChanged } from "firebase/auth";

export default function Cart() {
  const {
    cartItems,
    removeItemFromCart,
    increaseQuantity,
    decreaseQuantity,
    clearCart,
    totalItems,
    totalPrice,
  } = useCart();

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  // TEMP: remove Firebase for now
  useEffect(() => {
    // onAuthStateChanged(auth, (user) => setCurrentUser(user));
    setCurrentUser(true); // allow checkout
  }, []);

  const handleCheckout = () => {
    if (!currentUser) {
      alert("You must be logged in to proceed.");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="cart-empty">
        <h2>Your Cart is Empty</h2>
        <Link to="/products" className="cart-shop-btn">
          Browse Products →
        </Link>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <h1 className="cart-title">Shopping Cart</h1>

      <div className="cart-grid">

        {/* LEFT — ITEMS */}
        <div className="cart-items">
          {cartItems.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.thumbnail} alt={item.title} />

              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p className="cart-price">₹{item.price.toFixed(2)}</p>

                <div className="cart-qty">
                  <button onClick={() => decreaseQuantity(item.id)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => increaseQuantity(item.id)}>+</button>
                </div>

                <p className="cart-subtotal">
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  className="cart-remove"
                  onClick={() => removeItemFromCart(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT — SUMMARY */}
        <div className="cart-summary">
          <h2>Order Summary</h2>

          <p>Items: {totalItems}</p>
          <p className="cart-summary-total">
            Total: <strong>₹{totalPrice.toFixed(2)}</strong>
          </p>

          <button onClick={handleCheckout} className="cart-checkout-btn">
            Proceed to Checkout
          </button>

          <button onClick={clearCart} className="cart-clear-btn">
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  );
}
