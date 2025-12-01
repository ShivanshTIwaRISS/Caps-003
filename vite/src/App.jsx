import { useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import "./index.css";
import api from "./services/api";
// Layout
import Navbar from "./Navbar";
import Footer from "./Footer";

// Pages
import Login from "./Login";
import Signup from "./Signup";
import Home from "./StorePreview";
import Products from "./Products";
import ProductDetails from "./ProductDetails";
import GenericInfoPage from "./GenericInfoPage"; 
import Checkout from "./Checkout";
import Cart from "./Cart";
import OrderHistory from "./OrderHistory";
import ProtectedRoute from "./ProtectedRoute";
import Profile from "./Profile";




export default function App() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // -------------------- SIGNUP --------------------
  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/signup", form);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/"); // Redirect to home
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  // -------------------- LOGIN --------------------
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
         localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/"); // Redirect to home
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="os-root">
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              form={form}
              handleChange={handleChange}
              handleLogin={handleLogin}
            />
          }
        />

        {/* SIGNUP */}
        <Route
          path="/signup"
          element={
            <Signup
              form={form}
              handleChange={handleChange}
              handleSignup={handleSignup}
            />
          }
        />

        {/* HOME (with Navbar + Footer) */}
        <Route
          path="/"
          element={
            <>
              <Navbar />
              <Home />
              <Footer />
            </>
          }
        />

        {/* PRODUCTS PAGE */}
        <Route
          path="/products"
          element={
            <>
              <Navbar />
              <Products />
              <Footer />
            </>
          }
        />

        {/* PRODUCT DETAILS PAGE */}
        <Route
          path="/product/:id"
          element={
            <>
              <Navbar />
              <ProductDetails />
              <Footer />
            </>
          }
        />
        <Route
          path="/info/:page"
          element={
            <>
              <Navbar />
              <GenericInfoPage />
              <Footer />
            </>
          }
        />
        {/* PROFILE PAGE (Protected) */}
<Route
  path="/profile"
  element={
    <ProtectedRoute>
      <Navbar />
      <Profile />
      <Footer />
    </ProtectedRoute>
  }
/>

        {/* CART (Protected) */}
<Route
  path="/cart"
  element={
    <ProtectedRoute>
      <Navbar />
      <Cart />
      <Footer />
    </ProtectedRoute>
  }
/>

{/* CHECKOUT (Protected) */}
<Route
  path="/checkout"
  element={
    <ProtectedRoute>
      <Navbar />
      <Checkout />
      <Footer />
    </ProtectedRoute>
  }
/>

{/* ORDERS (Protected) */}
<Route
  path="/orders"
  element={
    <ProtectedRoute>
      <Navbar />
      <OrderHistory />
      <Footer />
    </ProtectedRoute>
  }
/>




        {/* Unknown routes → HOME */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  );
}
