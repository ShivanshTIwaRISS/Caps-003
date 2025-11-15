import { useState, useEffect } from "react";
import "./index.css";
import api from "./services/api";

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
      localStorage.setItem("token", res.data.token);
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
      <TopNav view={view} setView={setView} onLogout={handleLogout} />

      {view === "home" ? (
        <StorePreview />
      ) : (
        <div className="auth-shell">
          <MarketingPane />
          <div className="auth-pane">
            <div className="welcome-strip">
              <div className="welcome-badge">OS</div>
              <div>
                <h1>Welcome to OS</h1>
                <p>Sign in or create your account in seconds.</p>
              </div>
            </div>

            {view === "signup" ? (
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
                <button type="submit" className="cta">
                  Create account
                </button>

                <p className="swap">
                  Already have an account?{" "}
                  <button
                    type="button"
                    className="linklike"
                    onClick={() => setView("login")}
                  >
                    Login
                  </button>
                </p>
              </form>
            ) : (
              <form className="auth-card" onSubmit={handleLogin}>
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
                  placeholder="Enter your password"
                  type="password"
                />
                <button type="submit" className="cta">
                  Login
                </button>

                <p className="swap">
                  Don’t have an account?{" "}
                  <button
                    type="button"
                    className="linklike"
                    onClick={() => setView("signup")}
                  >
                    Create one
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}


function TopNav({ view, setView, onLogout }) {
  return (
    <header className="topnav">
      <div className="brand">
        <span className="brand-dot" />
        OS
      </div>
      <div className="nav-actions">
        {view === "home" ? (
          <button className="ghost" onClick={onLogout}>
            Logout
          </button>
        ) : (
          <>
            <button
              className={`ghost ${view === "login" ? "active" : ""}`}
              onClick={() => setView("login")}
            >
              Login
            </button>
            <button
              className={`chip ${view === "signup" ? "active" : ""}`}
              onClick={() => setView("signup")}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
}

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

function MarketingPane() {
  return (
    <div className="mk-pane">
      <div className="blob" />
      <div className="carousel">
        {[
          "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop",
          "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1600&auto=format&fit=crop",
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

function StorePreview() {
  return (
    <main className="store">
      <section className="hero">
        <div className="hero-copy">
          <h1>
           DEMO HOME PAGE
          </h1>
          <h1>
            Discover. <span>Shop.</span> Repeat.
          </h1>
          <p>Handpicked fashion, tech, and lifestyle—shipped lightning fast.</p>
          <div className="hero-actions">
            <button className="cta">Explore deals</button>
            <button className="ghost">Browse categories</button>
          </div>
        </div>
        <div className="hero-grid">
          {[
            "https://images.unsplash.com/photo-1520975682031-ae4e2b4342d1?q=80&w=1400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400&auto=format&fit=crop",
            "https://images.unsplash.com/photo-1512499617640-c2f999098c67?q=80&w=1400&auto=format&fit=crop",
          ].map((src, i) => (
            <div key={i} className="hero-tile" style={{ backgroundImage: `url(${src})` }} />
          ))}
        </div>
      </section>

      <section className="categories">
        {["New Arrivals", "Electronics", "Sneakers", "Accessories", "Home"].map((c, i) => (
          <button key={i} className="pill">
            {c}
          </button>
        ))}
      </section>

      <section className="products">
        {PRODUCTS.map((p) => (
          <article className="product" key={p.id}>
            <div className="product-img" style={{ backgroundImage: `url(${p.img})` }} />
            <div className="product-info">
              <h3>{p.title}</h3>
              <p className="price">${p.price}</p>
              <button className="mini-cta">Add to cart</button>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

const PRODUCTS = [
  {
    id: 1,
    title: "Air Mesh Sneakers",
    price: 129,
    img: "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 2,
    title: "Noise-Cancel Headphones",
    price: 249,
    img: "https://images.unsplash.com/photo-1518443952243-72ccbd4f3830?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 3,
    title: "Minimal Tote Bag",
    price: 79,
    img: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=1400&auto=format&fit=crop",
  },
  {
    id: 4,
    title: "Wireless Keyboard",
    price: 99,
    img: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400&auto=format&fit=crop",
  },
];
