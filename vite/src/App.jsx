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
import StorePreview from "./StorePreview";
import Products from "./Products";
import ProductDetails from "./ProductDetails";

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

      setForm({ name: "", email: "", password: "" });
      navigate("/home"); // Redirect to home
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

      setForm({ name: "", email: "", password: "" });

      navigate("/home"); // Redirect to home
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="os-root">
      <Routes>
        {/* Default → HOME (not login anymore) */}
        <Route path="/" element={<Navigate to="/home" />} />

        {/* LOGIN */}
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
          path="/home"
          element={
            <>
              <Navbar />
              <StorePreview />
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

        {/* Unknown routes → HOME */}
        <Route path="*" element={<Navigate to="/home" />} />
      </Routes>
    </div>
  );
}
