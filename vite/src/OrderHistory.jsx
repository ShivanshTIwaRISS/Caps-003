import React, { useEffect, useState } from "react";
import api from "./services/api"; 

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // TEMPORARY DUMMY ORDER DATA (used only if backend has no orders)
  const dummyOrders = [
    {
      id: "DUMMY-ORDER-001",
      createdAt: new Date().toISOString(),
      total: 199,
      items: [
        {
          title: "Wireless Headphones",
          quantity: 1,
          price: 199,
          thumbnail: "https://i.imgur.com/QZkF1K0.jpeg",
        },
      ],
    },
  ];

  useEffect(() => {
    setLoading(true);

    
    //  BACKEND ORDER HISTORY FETCH
    api
      .get("/orders")
      .then((res) => {
        const data = res.data;

        if (!data || data.length === 0) {
          setOrders(dummyOrders); // fallback
        } else {
          // Format matches your old Firebase-like UI
          const formatted = data.map((order) => ({
            id: order.id,
            createdAt: order.createdAt,
            total: order.total,
            items: order.items,
          }));

          setOrders(formatted);
        }

        setLoading(false);
      })
      .catch((err) => {
        console.log("Order fetch error:", err);
        setOrders(dummyOrders);
        setLoading(false);
      });
  }, []);

  // ---------------- UI --------------------

  if (loading)
    return <p className="orders-loading">Loading orders...</p>;

  return (
    <div className="orders-page">
      <h2 className="orders-title">📦 Your Orders</h2>

      {orders.length === 0 ? (
        <p className="orders-empty">You haven't placed any orders yet.</p>
      ) : (
        <div className="orders-list">
          {orders.map((order) => (
            <div key={order.id} className="order-card">
              <div className="order-head">
                <span>Order ID: {order.id}</span>
                <span>
                  {new Date(order.createdAt).toLocaleString()}
                </span>
              </div>

              <div className="order-items">
                {order.items.map((item, index) => (
                  <div key={index} className="order-item">
                    <img
                      src={item.thumbnail}
                      alt={item.title}
                      className="order-item-img"
                    />

                    <div>
                      <p className="order-item-title">{item.title}</p>
                      <p className="order-item-qty">Qty: {item.quantity}</p>
                      <p className="order-item-price">₹{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="order-total">Total: ₹{order.total}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
