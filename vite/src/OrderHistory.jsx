import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "./services/api";
import {
  PackageIcon,
  TruckIcon,
  CheckIcon,
  ArrowRightIcon,
  ClockIcon,
  CloseIcon,
} from "./components/Icons";

const SAMPLE_ORDERS = [
  {
    id: "ORD-948210",
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    total: 54999,
    status: "Shipped",
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
    createdAt: new Date(Date.now() - 86400000 * 6).toISOString(),
    total: 4499,
    status: "Delivered",
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

export default function OrderHistory() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    let storedOrders = [];
    try {
      storedOrders = JSON.parse(localStorage.getItem("user_orders") || "[]");
    } catch (e) {
      storedOrders = [];
    }

    if (isMounted) {
      setOrders(storedOrders.length > 0 ? storedOrders : SAMPLE_ORDERS);
      setLoading(false);
    }

    const token = localStorage.getItem("accessToken");
    if (token) {
      api
        .get("/orders", { timeout: 4000 })
        .then((res) => {
          if (!isMounted) return;
          const backendOrders = Array.isArray(res.data) ? res.data : [];
          if (backendOrders.length > 0) {
            const normalised = backendOrders.map((o) => ({
              ...o,
              items: o.items || o.orderItems || [],
            }));

            // Smart deduplication to prevent duplicate orders
            const deduplicated = [...storedOrders];
            normalised.forEach((bOrder) => {
              const alreadyExists = deduplicated.some(
                (sOrder) =>
                  String(sOrder.id) === String(bOrder.id) ||
                  (sOrder.total === bOrder.total &&
                    new Date(sOrder.createdAt).getTime() === new Date(bOrder.createdAt).getTime())
              );
              if (!alreadyExists) {
                deduplicated.push(bOrder);
              }
            });

            setOrders(deduplicated.length > 0 ? deduplicated : SAMPLE_ORDERS);
          }
        })
        .catch(() => {});
    }

    return () => {
      isMounted = false;
    };
  }, []);

  const handleCancelOrder = (orderId) => {
    if (!window.confirm(`Are you sure you want to cancel Order #${orderId}?`)) {
      return;
    }

    const updated = orders.map((o) => {
      if (String(o.id) === String(orderId)) {
        return { ...o, status: "Cancelled", cancelledAt: new Date().toISOString() };
      }
      return o;
    });

    setOrders(updated);

    try {
      const stored = JSON.parse(localStorage.getItem("user_orders") || "[]");
      const updatedStored = stored.map((o) => {
        if (String(o.id) === String(orderId)) {
          return { ...o, status: "Cancelled", cancelledAt: new Date().toISOString() };
        }
        return o;
      });
      localStorage.setItem("user_orders", JSON.stringify(updatedStored));
    } catch (e) {}
  };

  const computeOrderInfo = (order) => {
    if (order.status === "Cancelled") {
      return {
        currentStatus: "Cancelled",
        stepIndex: -1,
        isDelivered: false,
        isCancelled: true,
        deliveryDateStr: "Order Cancelled",
      };
    }

    const createdTime = new Date(order.createdAt || Date.now()).getTime();
    const deliveryTime = createdTime + 3 * 24 * 60 * 60 * 1000;
    const now = Date.now();
    const elapsedHours = (now - createdTime) / (1000 * 60 * 60);

    const deliveryDateStr = new Date(deliveryTime).toLocaleDateString("en-IN", {
      weekday: "long",
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    let currentStatus;
    let stepIndex;

    if (now >= deliveryTime) {
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

    const isDelivered = now >= deliveryTime;
    return { currentStatus, stepIndex, isDelivered, isCancelled: false, deliveryDateStr };
  };

  const stepClass = (current, step) => {
    if (current === -1) return "";
    if (step < current) return "done";
    if (step === current) return "current";
    return "";
  };

  if (loading) {
    return (
      <div className="orders-page">
        <h1 className="orders-title">Orders &amp; Shipment Tracking</h1>
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
          Orders &amp; Live Tracking
        </h1>
        <Link
          to="/products"
          className="cta-secondary"
          style={{ padding: "8px 16px", fontSize: "0.88rem", display: "inline-flex", alignItems: "center", gap: "6px" }}
        >
          <span>New Order</span>
          <ArrowRightIcon size={14} />
        </Link>
      </div>

      {orders.length === 0 ? (
        <div className="orders-empty">
          <h2>No orders placed yet</h2>
          <p style={{ color: "var(--text-muted)", margin: "10px 0 24px" }}>
            When you place an order, its live tracking status will appear here.
          </p>
          <Link to="/products" className="cta-primary">
            Start Shopping
          </Link>
        </div>
      ) : (
        <div>
          {orders.map((order) => {
            const orderDateStr = new Date(order.createdAt).toLocaleDateString("en-IN", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            const { currentStatus, stepIndex, isDelivered, isCancelled, deliveryDateStr } =
              computeOrderInfo(order);

            const orderItems = order.items || order.orderItems || [];

            return (
              <div key={order.id} className="order-card">
                {/* Header */}
                <div className="order-head">
                  <div>
                    <span className="order-id-title">Order #{order.id}</span>
                    <div className="order-date-text">Placed on {orderDateStr}</div>
                  </div>

                  <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
                    {/* Cancel Order Button */}
                    {!isDelivered && !isCancelled && (
                      <button
                        onClick={() => handleCancelOrder(order.id)}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "8px",
                          border: "1px solid var(--brand-danger)",
                          background: "rgba(239, 68, 68, 0.1)",
                          fontSize: "0.82rem",
                          color: "var(--brand-danger)",
                          fontWeight: 700,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          gap: "4px",
                        }}
                      >
                        <CloseIcon size={14} />
                        <span>Cancel Order</span>
                      </button>
                    )}

                    <button
                      onClick={() =>
                        alert(`Invoice for Order #${order.id} will be emailed to your registered address.`)
                      }
                      style={{
                        padding: "6px 14px",
                        borderRadius: "8px",
                        border: "1px solid var(--panel-border)",
                        fontSize: "0.82rem",
                        color: "var(--text-muted)",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      Download Invoice
                    </button>

                    <span
                      style={{
                        background: isCancelled
                          ? "rgba(239, 68, 68, 0.15)"
                          : isDelivered
                          ? "rgba(16, 185, 129, 0.15)"
                          : "var(--chip-bg)",
                        color: isCancelled
                          ? "var(--brand-danger)"
                          : isDelivered
                          ? "var(--brand-accent)"
                          : "var(--brand-primary)",
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
                      {isCancelled ? (
                        <span style={{ color: "var(--brand-danger)", fontWeight: 700 }}>
                          Order has been cancelled upon user request
                        </span>
                      ) : isDelivered ? (
                        <>
                          Package delivered on <strong>{deliveryDateStr}</strong>
                        </>
                      ) : (
                        <>
                          Estimated Delivery: <strong>{deliveryDateStr}</strong>{" "}
                          <span style={{ color: "var(--brand-accent)", fontWeight: 700 }}>
                            (On Schedule)
                          </span>
                        </>
                      )}
                    </span>
                  </div>
                  <span
                    style={{
                      color: isCancelled
                        ? "var(--brand-danger)"
                        : isDelivered
                        ? "var(--brand-accent)"
                        : "var(--brand-primary)",
                      fontWeight: 700,
                      fontSize: "0.82rem",
                    }}
                  >
                    {isCancelled ? "Cancelled" : isDelivered ? "Completed" : "In Progress"}
                  </span>
                </div>

                {/* Tracking Stepper */}
                {!isCancelled && (
                  <div className="order-tracking-stepper">
                    {[
                      { label: "Ordered", icon: <CheckIcon size={13} /> },
                      { label: "Shipped", icon: <CheckIcon size={13} /> },
                      { label: "Out for Delivery", icon: <TruckIcon size={13} /> },
                      { label: "Delivered", icon: <PackageIcon size={13} /> },
                    ].map((step, idx) => (
                      <div key={idx} className={`track-step ${stepClass(stepIndex, idx)}`}>
                        <div className="track-step-dot">{step.icon}</div>
                        <span className="track-step-label">{step.label}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Order Items */}
                <div className="order-items-list">
                  {orderItems.map((item, idx) => (
                    <div key={idx} className="order-item-row">
                      <img
                        src={item.thumbnail || "https://via.placeholder.com/56"}
                        alt={item.title}
                      />
                      <div style={{ flex: 1 }}>
                        <div className="order-item-title">{item.title}</div>
                        <div className="order-item-meta">
                          Qty: {item.quantity || 1} &bull; Unit Price: ₹
                          {Number(item.price || 0).toLocaleString("en-IN")}
                        </div>
                      </div>
                      <button
                        onClick={() =>
                          navigate(`/product/${item.productId || 1}`)
                        }
                        style={{
                          fontSize: "0.82rem",
                          color: "var(--brand-primary)",
                          fontWeight: 700,
                          cursor: "pointer",
                        }}
                      >
                        Buy Again
                      </button>
                    </div>
                  ))}
                </div>

                {/* Footer */}
                <div className="order-footer-row">
                  <span style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>
                    Courier Tracking: OS-IN-{String(order.id || "").replace(/\D/g, "")}
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
