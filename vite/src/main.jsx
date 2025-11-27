import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { CartProvider } from "./CartContext";   // <-- IMPORTANT

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <CartProvider>     {/*  <-- WRAP HERE */}
        <App />
      </CartProvider>
    </BrowserRouter>
  </React.StrictMode>
);
