import React, { createContext, useReducer, useContext, useEffect } from "react";
import api from "./services/api";

const CartContext = createContext();
export function useCart() {
  return useContext(CartContext);
}

const getSavedCart = () => {
  try {
    const saved = localStorage.getItem("local_cart");
    return saved ? JSON.parse(saved) : [];
  } catch (e) {
    return [];
  }
};

const initialState = {
  cartItems: getSavedCart(),
  loading: false,
};

function cartReducer(state, action) {
  let updatedItems = [];
  switch (action.type) {
    case "SET_CART":
      updatedItems = action.payload;
      break;

    case "ADD_ITEM_LOCAL": {
      const existingIdx = state.cartItems.findIndex(
        (i) => (i.productId || i.id) === (action.payload.productId || action.payload.id)
      );
      if (existingIdx > -1) {
        updatedItems = state.cartItems.map((item, idx) =>
          idx === existingIdx ? { ...item, quantity: item.quantity + 1 } : item
        );
      } else {
        updatedItems = [...state.cartItems, { ...action.payload, quantity: 1, cartItemId: Date.now() }];
      }
      break;
    }

    case "UPDATE_QTY_LOCAL":
      updatedItems = state.cartItems.map((item) =>
        (item.cartItemId || item.id) === action.payload.id
          ? { ...item, quantity: action.payload.quantity }
          : item
      );
      break;

    case "REMOVE_ITEM_LOCAL":
      updatedItems = state.cartItems.filter(
        (item) => (item.cartItemId || item.id) !== action.payload
      );
      break;

    case "CLEAR_CART":
      updatedItems = [];
      break;

    default:
      return state;
  }

  try {
    localStorage.setItem("local_cart", JSON.stringify(updatedItems));
  } catch (e) {}

  return { ...state, cartItems: updatedItems, loading: false };
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  const loadCart = async () => {
    const token = localStorage.getItem("accessToken");
    if (!token) return;

    try {
      const res = await api.get("/cart", { timeout: 2500 });
      if (Array.isArray(res.data) && res.data.length > 0) {
        const normalized = res.data.map((item) => ({
          ...item,
          cartItemId: item.id,
        }));
        dispatch({ type: "SET_CART", payload: normalized });
      }
    } catch (err) {
      console.warn("Cart sync using local state:", err.message);
    }
  };

  useEffect(() => {
    loadCart();
  }, []);

  const addItemToCart = async (product) => {
    const pId = product.productId || product.id;
    dispatch({
      type: "ADD_ITEM_LOCAL",
      payload: {
        productId: pId,
        id: pId,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
      },
    });

    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        await api.post("/cart/add", {
          productId: pId,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
        });
      } catch (err) {
        console.warn("Backend add to cart fallback:", err.message);
      }
    }
  };

  const removeItemFromCart = async (cartItemId) => {
    dispatch({ type: "REMOVE_ITEM_LOCAL", payload: cartItemId });

    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        await api.delete(`/cart/remove/${cartItemId}`);
      } catch (err) {
        console.warn("Backend remove fallback:", err.message);
      }
    }
  };

  const clearCart = async () => {
    dispatch({ type: "CLEAR_CART" });

    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        await api.delete("/cart/clear");
      } catch (err) {
        console.warn("Backend clear cart fallback:", err.message);
      }
    }
  };

  const updateItemQuantity = async (cartItemId, quantity) => {
    if (quantity < 1) return removeItemFromCart(cartItemId);

    dispatch({
      type: "UPDATE_QTY_LOCAL",
      payload: { id: cartItemId, quantity },
    });

    const token = localStorage.getItem("accessToken");
    if (token) {
      try {
        await api.put(`/cart/update/${cartItemId}`, { quantity });
      } catch (err) {
        console.warn("Backend update quantity fallback:", err.message);
      }
    }
  };

  const totalItems = state.cartItems.reduce((sum, i) => sum + (i.quantity || 1), 0);
  const totalPrice = state.cartItems.reduce(
    (sum, i) => sum + i.price * (i.quantity || 1),
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
