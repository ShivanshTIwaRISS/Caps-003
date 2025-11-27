import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
// import { auth } from "../../firebase";
// import { onAuthStateChanged } from "firebase/auth";

export default function Cart() {
  const {
    cartItems,
    removeItemFromCart,   // ⭐ NOW backend-remove (cartItemId required)
    // increaseQuantity,     // ❌ local only → we will NOT use this
    // decreaseQuantity,     // ❌ local only → we will NOT use this
    clearCart,            // ⭐ backend-clear
    totalItems,
    totalPrice,
    reloadCart            // ⭐ load from backend
  } = useCart();

  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const token = localStorage.getItem("accessToken");

  // TEMP: remove Firebase for now
  useEffect(() => {
    setCurrentUser(true); // allow checkout
  }, []);

  // ⭐ Load cart from backend on mount
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

  // ⭐ BACKEND: Increase Quantity
  const handleIncrease = async (item) => {
    await fetch(`https://caps-003.onrender.com/cart/add`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId: item.productId || item.id,
        title: item.title,
        price: item.price,
        thumbnail: item.thumbnail,
      }),
    });

    reloadCart(); // ⭐ refresh UI
  };

  // ⭐ BACKEND: Decrease Quantity
  const handleDecrease = async (item) => {
    if (item.quantity === 1) {
      return await handleRemove(item.id, item.cartItemId);
    }

    await fetch(`https://caps-003.onrender.com/cart/remove/${item.cartItemId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    reloadCart(); // refresh from backend
  };

  // ⭐ BACKEND: Remove item fully
  const handleRemove = async (productId, cartItemId) => {
    await removeItemFromCart(cartItemId); // backend function
    reloadCart();
  };

  // ⭐ BACKEND: Clear Cart
  const handleClear = async () => {
    await clearCart();
    reloadCart();
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
                  {/* ⭐ backend decrease */}
                  <button onClick={() => handleDecrease(item)}>-</button>

                  <span>{item.quantity}</span>

                  {/* ⭐ backend increase */}
                  <button onClick={() => handleIncrease(item)}>+</button>
                </div>

                <p className="cart-subtotal">
                  Subtotal: ₹{(item.price * item.quantity).toFixed(2)}
                </p>

                <button
                  className="cart-remove"
                  onClick={() => handleRemove(item.id, item.cartItemId)}
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
