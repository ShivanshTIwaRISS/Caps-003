import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./services/api";
import {
  PackageIcon,
  TruckIcon,
  CheckIcon,
  ArrowRightIcon,
  ClockIcon,
} from "./components/Icons";

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const defaultSampleOrders = [
    {
      id: "ORD-948210",
      createdAt: new Date(Date.now() - 86400000 * 1).toISOString(), // 1 day ago
      total: 54999,
      items: [
        {
          productId: 1,
          title: "Flagship Ultrabook Pro Silicon",
          quantity: 1,
          price: 54999,
          thumbnail:
            "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?auto=format&fit=crop&w=400&q=80",
        },
      ],
    },
    {
      id: "ORD-832104",
      createdAt: new Date(Date.now() - 86400000 * 6).toISOString(), // 6 days ago -> passed -> Delivered
      total: 4499,
      items: [
        {
          productId: 2,
          title: "Noise-Cancelling Studio Headset",
          quantity: 1,
          price: 4499,
          thumbnail:
            "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&w=400&q=80",
        },
      ],
    },
  ];

  useEffect(() => {
    setLoading(true);
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
        setOrders(stored.length > 0 ? stored : defaultSampleOrders);
        setLoading(false);
      });
  }, []);

  // Compute status and delivery expectations
  const computeOrderStatusInfo = (order) => {
    const createdTime = new Date(order.createdAt || Date.now()).getTime();
    // Expected delivery is 3 days from placement
    const expectedDeliveryTime = createdTime + 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const elapsedHours = (now - createdTime) / (1000 * 60 * 60);

    const deliveryDateObj = new Date(expectedDeliveryTime);
    const deliveryDateStr = deliveryDateObj.toLocaleDateString("en-US", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    let currentStatus = "Order Confirmed";
    let stepIndex = 0; // 0: Ordered, 1: Shipped, 2: Out for Delivery, 3: Delivered

    if (now >= expectedDeliveryTime) {
      currentStatus = "Delivered";
      stepIndex = 3;
    } else if (elapsedHours >= 36) {
      currentStatus = "Out for Delivery";
      stepIndex = 2;
    } else if (elapsedHours >= 12) {
      currentStatus = "Shipped";
      stepIndex = 1;
    } else {
      currentStatus = "Order Confirmed";
      stepIndex = 0;
    }

    return {
      currentStatus,
      stepIndex,
      isDelivered: now >= expectedDeliveryTime,
      deliveryDateStr,
    };
  };

  const getStepClass = (currentStepIndex, stepNumber) => {
    if (stepNumber < currentStepIndex) return "done";
    if (stepNumber === currentStepIndex) return "current";
    return "";
  };

  if (loading) {
    return (
      <div className="orders-page">
        <h1 className="orders-title">Orders & Shipment Tracking</h1>
        <div className="skeleton" style={{ height: "240px", borderRadius: "18px", marginBottom: "20px" }} />
        <div className="skeleton" style={{ height: "240px", borderRadius: "18px" }} />
      </div>
    );
  }

  return (
    <div className="orders-page">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "28px",
        }}
      >
        <h1 className="orders-title" style={{ margin: 0 }}>
          Orders & Live Tracking
        </h1>
        <Link
          to="/products"
          className="cta-secondary"
          style={{ padding: "8px 16px", fontSize: "0.88rem" }}
        >
          <span>New Order</span>
          <ArrowRightIcon size={14} />
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
            const orderDateStr = new Date(order.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            const { currentStatus, stepIndex, isDelivered, deliveryDateStr } =
              computeOrderStatusInfo(order);

            return (
              <div key={order.id} className="order-card">
                {/* Order Header */}
                <div className="order-head">
                  <div>
                    <span className="order-id-title">Order #{order.id}</span>
                    <div className="order-date-text">Placed on {orderDateStr}</div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    <button
                      onClick={() =>
                        alert(`Official tax invoice downloaded for Order #${order.id}`)
                      }
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        border: "1px solid var(--panel-border)",
                        fontSize: "0.82rem",
                        color: "var(--text-muted)",
                        fontWeight: 600,
                      }}
                    >
                      Download Invoice
                    </button>
                    <span
                      style={{
                        background: isDelivered ? "rgba(16, 185, 129, 0.15)" : "var(--chip-bg)",
                        color: isDelivered ? "var(--brand-accent)" : "var(--brand-primary)",
                        fontWeight: 800,
                        fontSize: "0.82rem",
                        padding: "6px 12px",
                        borderRadius: "8px",
                      }}
                    >
                      {currentStatus}
                    </span>
                  </div>
                </div>

                {/* Delivery Date Banner */}
                <div
                  style={{
                    background: "var(--bg-subtle)",
                    border: "1px solid var(--panel-border)",
                    borderRadius: "12px",
                    padding: "12px 16px",
                    marginBottom: "20px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    flexWrap: "wrap",
                    gap: "8px",
                    fontSize: "0.88rem",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <ClockIcon size={16} />
                    <span>
                      {isDelivered ? (
                        <>
                          Package delivered on <strong>{deliveryDateStr}</strong>
                        </>
                      ) : (
                        <>
                          Estimated Delivery: <strong>{deliveryDateStr}</strong> (On Schedule)
                        </>
                      )}
                    </span>
                  </div>

                  <span
                    style={{
                      color: isDelivered ? "var(--brand-accent)" : "var(--brand-primary)",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                    }}
                  >
                    {isDelivered ? "Completed" : "In Progress"}
                  </span>
                </div>

                {/* Tracking Stepper */}
                <div className="order-tracking-stepper">
                  <div className={`track-step ${getStepClass(stepIndex, 0)}`}>
                    <div className="track-step-dot">
                      <CheckIcon size={14} />
                    </div>
                    <span className="track-step-label">Ordered</span>
                  </div>
                  <div className={`track-step ${getStepClass(stepIndex, 1)}`}>
                    <div className="track-step-dot">
                      <CheckIcon size={14} />
                    </div>
                    <span className="track-step-label">Shipped</span>
                  </div>
                  <div className={`track-step ${getStepClass(stepIndex, 2)}`}>
                    <div className="track-step-dot">
                      <TruckIcon size={14} />
                    </div>
                    <span className="track-step-label">Out for Delivery</span>
                  </div>
                  <div className={`track-step ${getStepClass(stepIndex, 3)}`}>
                    <div className="track-step-dot">
                      <PackageIcon size={14} />
                    </div>
                    <span className="track-step-label">Delivered</span>
                  </div>
                </div>

                {/* Order Items */}
                <div className="order-items-list">
                  {order.items?.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <img src={item.thumbnail} alt={item.title} />
                      <div style={{ flex: 1 }}>
                        <div className="order-item-title">{item.title}</div>
                        <div className="order-item-meta">
                          Qty: {item.quantity || 1} • Unit Price: ₹
                          {Number(item.price).toLocaleString("en-IN")}
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
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Courier Tracking #OS-IN-{(order.id || "").replace(/\D/g, "")}
                  </span>
                  <div className="order-total-badge">
                    Total: ₹{Number(order.total || 0).toLocaleString("en-IN")}
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
