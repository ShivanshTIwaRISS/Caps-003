import React, { createContext, useReducer, useContext, useEffect } from "react";
import api from "./services/api"; 

const CartContext = createContext();
export function useCart() {
  return useContext(CartContext);
}

const initialState = {
  cartItems: [],
  loading: true,
};

function cartReducer(state, action) {
  switch (action.type) {
    case "SET_CART":
      return { ...state, cartItems: action.payload, loading: false };

    case "CLEAR_CART":
      return { ...state, cartItems: [], loading: false };

    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  /* ---------------------------------------------------
     1️⃣ LOAD CART FROM BACKEND  — ⭐ FIXED HERE
  --------------------------------------------------- */
  const loadCart = async () => {
    try {
      const res = await api.get("/cart");

      const normalized = res.data.map((item) => ({
        ...item,
        cartItemId: item.id, 
      }));

      dispatch({ type: "SET_CART", payload: normalized });
    } catch (err) {
      console.log("❌ Cart load failed:", err);
      dispatch({ type: "SET_CART", payload: [] });
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (token) loadCart();
  }, []);

  /* ---------------------------------------------------
     2️⃣ ADD ITEM (productId FIXED)
  --------------------------------------------------- */
  const addItemToCart = async (product) => {
    try {
      await api.post("/cart/add", {
        productId: product.productId || product.id,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
      });

      await loadCart();
    } catch (err) {
      console.log("❌ Add to cart failed:", err);
    }
  };

  /* ---------------------------------------------------
     3️⃣ REMOVE ITEM
  --------------------------------------------------- */
  const removeItemFromCart = async (cartItemId) => {
    try {
      await api.delete(`/cart/remove/${cartItemId}`);
      await loadCart();
    } catch (err) {
      console.log("❌ Remove failed:", err);
    }
  };

  /* ---------------------------------------------------
     4️⃣ CLEAR CART
  --------------------------------------------------- */
  const clearCart = async () => {
    try {
      await api.delete("/cart/clear");
      dispatch({ type: "CLEAR_CART" });
    } catch (err) {
      console.log("❌ Clear cart failed:", err);
    }
  };

  /* ---------------------------------------------------
     5️⃣ UPDATE ITEM (PUT)
  --------------------------------------------------- */
  const updateItemQuantity = async (cartItemId, quantity) => {
    try {
      await api.put(`/cart/update/${cartItemId}`, { quantity });
      await loadCart();
    } catch (err) {
      console.log("❌ Update quantity failed:", err);
    }
  };

  /* ---------------------------------------------------
     6️⃣ TOTALS*/
  const totalItems = state.cartItems.reduce((sum, i) => sum + i.quantity, 0);
  const totalPrice = state.cartItems.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: state.cartItems,
        addItemToCart,
        removeItemFromCart,
        clearCart,
        updateItemQuantity, 
        totalItems,
        totalPrice,
        reloadCart: loadCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
