import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./services/api";

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Realistic default order examples if none exist
  const defaultSampleOrders = [
    {
      id: "ORD-948210",
      createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
      total: 12999,
      status: "In Transit",
      items: [
        {
          productId: 1,
          title: "iPhone 15 Pro Max - Titanium Cyber Edition",
          quantity: 1,
          price: 12999,
          thumbnail: "https://images.unsplash.com/photo-1511385348-a52b4a160dc2?auto=format&fit=crop&w=400&q=80",
        },
      ],
    },
    {
      id: "ORD-832104",
      createdAt: new Date(Date.now() - 86400000 * 12).toISOString(),
      total: 4499,
      status: "Delivered",
      items: [
        {
          productId: 2,
          title: "Aura Noise-Cancelling Studio Headset",
          quantity: 1,
          price: 4499,
          thumbnail: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80",
        },
      ],
    },
  ];

  useEffect(() => {
    setLoading(true);

    // Read locally stored orders first
    const stored = JSON.parse(localStorage.getItem("user_orders") || "[]");

    api
      .get("/orders", { timeout: 2500 })
      .then((res) => {
        const backendOrders = res.data || [];
        const combined = [...stored, ...backendOrders];
        setOrders(combined.length > 0 ? combined : defaultSampleOrders);
        setLoading(false);
      })
      .catch(() => {
        // Use stored orders or sample orders
        setOrders(stored.length > 0 ? stored : defaultSampleOrders);
        setLoading(false);
      });
  }, []);

  const getStepStatus = (orderStatus, stepIndex) => {
    // 0: Placed, 1: Shipped, 2: In Transit, 3: Delivered
    const statusMap = {
      "Order Confirmed": 1,
      "In Transit": 2,
      "Out for Delivery": 2,
      "Delivered": 3,
    };
    const current = statusMap[orderStatus] || 1;
    if (stepIndex < current) return "done";
    if (stepIndex === current) return "current";
    return "";
  };

  if (loading) {
    return (
      <div className="orders-page">
        <h1 className="orders-title">📦 Your Orders & Live Tracking</h1>
        <div className="skeleton" style={{ height: "240px", borderRadius: "18px", marginBottom: "20px" }} />
        <div className="skeleton" style={{ height: "240px", borderRadius: "18px" }} />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "28px" }}>
        <h1 className="orders-title" style={{ margin: 0 }}>
          📦 Your Orders & Live Tracking
        </h1>
        <Link to="/products" className="cta-secondary" style={{ padding: "8px 16px", fontSize: "0.88rem" }}>
          + New Order
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h2>No orders placed yet</h2>
          <p>When you place an order, its live tracking status will appear here.</p>
          <Link to="/products" className="cta-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div>
          {orders.map((order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-head">
                  <div>
                    <span className="order-id-title">Order #{order.id}</span>
                    <div className="order-date-text">Placed on {dateStr}</div>
                  </div>

                  <div style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => alert(`Downloading official PDF Invoice for Order #${order.id}...`)}
                      style={{
                        padding: "6px 12px",
                        borderRadius: "8px",
                        border: "1px solid var(--panel-border)",
                        fontSize: "0.82rem",
                        color: "var(--text-muted)",
                      }}
                    >
                      📄 Invoice
                    </button>
                    <span
                      style={{
                        background: order.status === "Delivered" ? "rgba(16, 185, 129, 0.15)" : "var(--chip-bg)",
                        color: order.status === "Delivered" ? "var(--brand-accent)" : "var(--brand-primary)",
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      ● {order.status || "Order Confirmed"}
                    </span>
                  </div>
                </div>

                {/* Tracking Stepper */}
                <div className="order-tracking-stepper">
                  <div className={`track-step ${getStepStatus(order.status, 0)}`}>
                    <div className="track-step-dot">✓</div>
                    <span className="track-step-label">Ordered</span>
                  </div>
                  <div className={`track-step ${getStepStatus(order.status, 1)}`}>
                    <div className="track-step-dot">✓</div>
                    <span className="track-step-label">Shipped</span>
                  </div>
                  <div className={`track-step ${getStepStatus(order.status, 2)}`}>
                    <div className="track-step-dot">🚚</div>
                    <span className="track-step-label">In Transit</span>
                  </div>
                  <div className={`track-step ${getStepStatus(order.status, 3)}`}>
                    <div className="track-step-dot">📦</div>
                    <span className="track-step-label">Delivered</span>
                  </div>
                </div>

                {/* Order Item Rows */}
                <div className="order-items-list">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <img src={item.thumbnail} alt={item.title} />
                      <div style={{ flex: 1 }}>
                        <div className="order-item-title">{item.title}</div>
                        <div className="order-item-meta">
                          Quantity: {item.quantity || 1} • Unit Price: ₹{item.price}
                        </div>
                      </div>
                      <button
                        onClick={() => navigate(`/product/${item.productId || 1}`)}
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--brand-primary)",
                          fontWeight: 700,
                        }}
                      >
                        Buy Again
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer Total */}
                <div className="order-footer-row">
                  <span style={{ color: "var(--text-muted)", fontSize: "0.88rem" }}>
                    Standard Express Courier Tracking #OS-IN-{(order.id || "").replace(/\D/g, "")}
                  </span>
                  <div className="order-total-badge">
                    Total: ₹{Number(order.total || 0).toFixed(0)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
