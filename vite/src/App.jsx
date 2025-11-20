import { useState, useEffect } from "react";
import "./index.css";
import api from "./services/api";

// Import Login & Signup components
import Login from "./Login";
import Signup from "./Signup";

import StorePreview from "./StorePreview"; // KEEP your existing file if you had it

export default function App() {
  const [view, setView] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setView("home");
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/signup", form);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      setView("home");
      setForm({ name: "", email: "", password: "" });
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
      setView("home");
      setForm({ name: "", email: "", password: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setView("login");
    setForm({ name: "", email: "", password: "" });
  };

  return (
    <div className="os-root">
      {view === "home" ? (
        <StorePreview />
      ) : view === "signup" ? (
        <Signup
          form={form}
          handleChange={handleChange}
          handleSignup={handleSignup}
          setView={setView}
          view={view}
          onLogout={handleLogout}
        />
      ) : (
        <Login
          form={form}
          handleChange={handleChange}
          handleLogin={handleLogin}
          setView={setView}
          view={view}
          onLogout={handleLogout}
        />
      )}
    </div>
  );
}
