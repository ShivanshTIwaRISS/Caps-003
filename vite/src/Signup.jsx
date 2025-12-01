import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Navbar from "./Navbar";

export default function Signup({ form, handleChange, handleSignup }) {
  const navigate = useNavigate();

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) navigate("/home");
  }, []);

  return (
    <>
      <Navbar />

      <div className="auth-shell">
        <MarketingPane />

        <div className="auth-pane">
          <div className="welcome-strip">
            <div className="welcome-badge">OS</div>
            <div>
              <h1>Welcome to OS</h1>
              <p>Create your account in seconds.</p>
            </div>
          </div>

          <form className="auth-card" onSubmit={handleSignup}>
            <FormField
              label="Full name"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Jane Doe"
            />

            <FormField
              label="Email"
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
              placeholder="Create a strong password"
              type="password"
            />

            <button type="submit" className="cta">Create account</button>

            <p className="swap">
              Already have an account?{" "}
              <button
                type="button"
                className="linklike"
                onClick={() => navigate("/login")}
              >
                Login
              </button>
            </p>
          </form>
        </div>
      </div>
    </>
  );
}

/* ------------------ FormField ------------------ */
function FormField({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        type={type}
        required
        autoComplete={name}
      />
    </label>
  );
}

/* ------------------ MarketingPane ------------------ */
function MarketingPane() {
  return (
    <div className="mk-pane">
      <div className="blob" />
      <div className="carousel">
        {[
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1600&auto=format&fit=crop"
        ].map((src, i) => (
          <div className="slide" key={i} style={{ backgroundImage: `url(${src})` }} />
        ))}
      </div>

      <div className="stat stat-a">
        <div className="stat-title">Active Carts</div>
        <div className="stat-value">1,274</div>
        <TinyBars />
      </div>

      <div className="stat stat-b">
        <div className="stat-title">Avg. Response</div>
        <div className="stat-value">134 ms</div>
        <TinyBars />
      </div>

      <ul className="usp">
        <li>Secure checkout</li>
        <li>Blazing fast</li>
        <li>Developer-first APIs</li>
        <li>Analytics-ready</li>
      </ul>
    </div>
  );
}

function TinyBars() {
  return (
    <div className="bars">
      {Array.from({ length: 14 }).map((_, i) => (
        <span key={i} style={{ animationDelay: `${i * 0.08}s` }} />
      ))}
    </div>
  );
}
