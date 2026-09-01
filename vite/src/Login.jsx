import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import { ShieldIcon, TruckIcon, CheckIcon } from "./components/Icons";

export default function Login({ form, handleChange, handleLogin }) {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) navigate("/");
  }, [navigate]);

  const onSubmitWrapper = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await handleLogin(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="auth-container">
        <div className="auth-card-wrapper">
          {/* Header Banner */}
          <div className="auth-header">
            <div className="auth-logo-badge">OS</div>
            <h2>Sign In to OS Store</h2>
            <p>Access your orders, saved addresses, and active shopping bag.</p>
          </div>

          {/* Form */}
          <form className="auth-form" onSubmit={onSubmitWrapper}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="name@company.com"
                required
                autoComplete="email"
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="auth-submit-btn" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>

            <div className="auth-switch">
              <span>Don't have an account?</span>{" "}
              <Link to="/signup" className="auth-link">
                Create an account
              </Link>
            </div>
          </form>

          {/* Security Footer */}
          <div className="auth-trust-row">
            <div className="trust-item">
              <ShieldIcon size={14} />
              <span>256-Bit SSL</span>
            </div>
            <div className="trust-item">
              <TruckIcon size={14} />
              <span>Express Delivery</span>
            </div>
            <div className="trust-item">
              <CheckIcon size={14} />
              <span>7-Day Returns</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
