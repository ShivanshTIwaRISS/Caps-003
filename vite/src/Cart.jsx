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
    reloadCart
  } = useCart();

  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(true);
  const token = localStorage.getItem("accessToken");

  // Load cart on mount
  useEffect(() => {
    if (token) reloadCart();
  }, [token, reloadCart]);

  const handleCheckout = () => {
    if (!currentUser) {
      alert("You must be logged in to proceed.");
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  /* ============================================
     BACKEND: Increase Quantity
  ============================================ */
  const handleIncrease = async (item) => {
    await updateItemQuantity(item.cartItemId, item.quantity + 1);
  };

  /* ============================================
     BACKEND: Decrease Quantity
  ============================================ */
  const handleDecrease = async (item) => {
    if (item.quantity === 1) {
      return await handleRemove(item.cartItemId);
    }

    await updateItemQuantity(item.cartItemId, item.quantity - 1);
  };

  /* ============================================
     BACKEND: Remove item fully
  ============================================ */
  const handleRemove = async (cartItemId) => {
    await removeItemFromCart(cartItemId);
  };

  /* ============================================
     BACKEND: Clear Cart
  ============================================ */
  const handleClear = async () => {
    await clearCart();
    reloadCart();
  };

  /* ============================================
     UI
  ============================================ */

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
            <div key={item.cartItemId} className="cart-item">
              <img src={item.thumbnail} alt={item.title} />

              <div className="cart-item-info">
                <h3>{item.title}</h3>
                <p className="cart-price">₹{item.price.toFixed(2)}</p>

                <div className="cart-qty">
                  <button onClick={() => handleDecrease(item)}>-</button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleIncrease(item)}>+</button>
                </div>

                <p className="cart-subtotal">
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  className="cart-remove"
                  onClick={() => handleRemove(item.cartItemId)}
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

          <button onClick={handleClear} className="cart-clear-btn">
            Clear Cart
          </button>
        </div>

      </div>
    </div>
  );
}
