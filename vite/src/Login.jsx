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

      <div className="auth-shell">
        <MarketingPane />

        <div className="auth-pane">
          <div className="welcome-strip">
            <div className="welcome-badge">OS</div>
            <div>
              <h1 style={{ fontSize: "1.3rem", fontWeight: 800 }}>Welcome Back</h1>
              <p style={{ fontSize: "0.84rem", color: "var(--text-muted)" }}>
                Sign in to your OS account to manage bag and orders.
              </p>
            </div>
          </div>

          <form className="auth-card" onSubmit={onSubmitWrapper} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <FormField
              label="Email Address"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@company.com"
              type="email"
            />

            <FormField
              label="Password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              type="password"
            />

            <button
              type="submit"
              className="cta-primary"
              disabled={loading}
              style={{ width: "100%", justifyContent: "center", marginTop: "8px" }}
            >
              {loading ? "Signing in..." : "Sign In to OS"}
            </button>

            <p style={{ textAlign: "center", fontSize: "0.88rem", color: "var(--text-muted)", marginTop: "10px" }}>
              Don’t have an account?{" "}
              <button
                type="button"
                onClick={() => navigate("/signup")}
                style={{ color: "var(--brand-primary)", fontWeight: 700, textDecoration: "underline" }}
              >
                Create an account
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

/* FormField */
function FormField({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="form-group">
      <label>{label}</label>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required
        autoComplete={name}
      />
    </div>
  );
}

/* MarketingPane */
function MarketingPane() {
  return (
    <div className="mk-pane">
      <div className="blob" />
      <div className="carousel">
        {[
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop",
        ].map((src, i) => (
          <div className="slide" key={i} style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>

      <div className="stat stat-a">
        <div className="stat-title">Active Shoppers</div>
        <div className="stat-value">50,000+</div>
      </div>

      <div className="stat stat-b">
        <div className="stat-title">Avg. Latency</div>
        <div className="stat-value">0 ms</div>
      </div>

      <ul className="usp">
        <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <ShieldIcon size={14} />
          <span>256-Bit SSL Checkout</span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <TruckIcon size={14} />
          <span>Same-Day Dispatch</span>
        </li>
        <li style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <CheckIcon size={14} />
          <span>7-Day Replacement</span>
        </li>
      </ul>
    </div>
  );
}
