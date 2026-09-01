import { useState, useEffect } from "react";
import { Routes, Route, Navigate, useNavigate, useLocation } from "react-router-dom";
import "./index.css";
import api from "./services/api";
import { WishlistProvider } from "./WishlistContext";

// Scroll to Top on page transition
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

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
import Wishlist from "./Wishlist";
import MobileBottomNav from "./MobileBottomNav";

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
      navigate("/");
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

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <WishlistProvider>
      <ScrollToTop />
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

          <Route
            path="/wishlist"
            element={
              <>
                <Navbar />
                <Wishlist />
                <Footer />
              </>
            }
          />

          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
        <MobileBottomNav />
      </div>
    </WishlistProvider>
  );
}
