// import React, { createContext, useReducer, useContext } from "react";

// const CartContext = createContext();

// /* -----------------------------
//    INITIAL CART STATE
// ----------------------------- */
// const initialState = {
//   cartItems: [],
// };

// /* -----------------------------
//    REDUCER LOGIC
// ----------------------------- */
// function cartReducer(state, action) {
//   switch (action.type) {
//     case "ADD_ITEM": {
//       const item = action.payload;
//       const existItem = state.cartItems.find((i) => i.id === item.id);

//       if (existItem) {
//         return {
//           ...state,
//           cartItems: state.cartItems.map((i) =>
//             i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
//           ),
//         };
//       } else {
//         return {
//           ...state,
//           cartItems: [...state.cartItems, { ...item, quantity: 1 }],
//         };
//       }
//     }

//     case "REMOVE_ITEM": {
//       return {
//         ...state,
//         cartItems: state.cartItems.filter((i) => i.id !== action.payload),
//       };
//     }

//     case "INCREASE_QUANTITY": {
//       return {
//         ...state,
//         cartItems: state.cartItems.map((i) =>
//           i.id === action.payload ? { ...i, quantity: i.quantity + 1 } : i
//         ),
//       };
//     }

//     case "DECREASE_QUANTITY": {
//       return {
//         ...state,
//         cartItems: state.cartItems
//           .map((i) =>
//             i.id === action.payload
//               ? { ...i, quantity: i.quantity - 1 }
//               : i
//           )
//           .filter((i) => i.quantity > 0),
//       };
//     }

//     case "CLEAR_CART": {
//       return { ...state, cartItems: [] };
//     }

//     default:
//       return state;
//   }
// }

// /* -----------------------------
//    PROVIDER COMPONENT
// ----------------------------- */
// export function CartProvider({ children }) {
//   const [state, dispatch] = useReducer(cartReducer, initialState);

//   const addItemToCart = (item) =>
//     dispatch({ type: "ADD_ITEM", payload: item });

//   const removeItemFromCart = (id) =>
//     dispatch({ type: "REMOVE_ITEM", payload: id });

//   const increaseQuantity = (id) =>
//     dispatch({ type: "INCREASE_QUANTITY", payload: id });

//   const decreaseQuantity = (id) =>
//     dispatch({ type: "DECREASE_QUANTITY", payload: id });

//   const clearCart = () => dispatch({ type: "CLEAR_CART" });

//   const totalItems = state.cartItems.reduce(
//     (sum, item) => sum + item.quantity,
//     0
//   );

//   const totalPrice = state.cartItems.reduce(
//     (sum, item) => sum + item.price * item.quantity,
//     0
//   );

//   return (
//     <CartContext.Provider
//       value={{
//         cartItems: state.cartItems,
//         addItemToCart,
//         removeItemFromCart,
//         increaseQuantity,
//         decreaseQuantity,
//         clearCart,
//         totalItems,
//         totalPrice,
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// }

// /* -----------------------------
//    CUSTOM HOOK (IMPORTANT)
// ----------------------------- */
// export function useCart() {
//   return useContext(CartContext);
// }
