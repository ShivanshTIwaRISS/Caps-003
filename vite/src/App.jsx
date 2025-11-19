import { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useNavigate,
} from "react-router-dom";

import "./index.css";
import api from "./services/api";

import Login from "./Login";
import Signup from "./Signup";
import Home from "./Home";

// import Navbar from "./components/Navbar";   // ⭐ ADD THIS
import Footer from "./components/Footer";   // ⭐ ADD THIS

/* ---------- AUTH WRAPPER COMPONENT ---------- */
function AppWrapper() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const isLoggedIn = () => !!localStorage.getItem("accessToken");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/signup", form);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      setForm({ name: "", email: "", password: "" });

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/login", form);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);

      setForm({ name: "", email: "", password: "" });

      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    navigate("/login");
  };

  return (
    <>
      {/* ⭐ Navbar should NOT show on login/signup pages */}
      {/* {window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup" && <Navbar />} */}

      <div className="os-root">
        <Routes>
          {/* HOME (Protected) */}
          <Route
            path="/"
            element={
              isLoggedIn() ? (
                <Home onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />

          {/* LOGIN */}
          <Route
            path="/login"
            element={
              isLoggedIn() ? (
                <Navigate to="/" replace />
              ) : (
                <Login
                  form={form}
                  handleChange={handleChange}
                  handleLogin={handleLogin}
                />
              )
            }
          />

          {/* SIGNUP */}
          <Route
            path="/signup"
            element={
              isLoggedIn() ? (
                <Navigate to="/" replace />
              ) : (
                <Signup
                  form={form}
                  handleChange={handleChange}
                  handleSignup={handleSignup}
                />
              )
            }
          />

          {/* CATCH ALL */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* ⭐ Footer should NOT show on login/signup pages */}
      {window.location.pathname !== "/login" &&
        window.location.pathname !== "/signup" && <Footer />}
    </>
  );
}

/* ---------- MAIN APP ---------- */
export default function App() {
  return (
    <Router>
      <AppWrapper />
    </Router>
  );
}
