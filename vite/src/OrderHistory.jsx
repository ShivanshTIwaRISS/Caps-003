import React, { useEffect, useState } from "react";

// ================= FIREBASE DISABLED FOR NOW =================
// import { db, auth } from "../../firebase";
// import {
//   collection,
//   query,
//   where,
//   orderBy,
//   onSnapshot,
// } from "firebase/firestore";
// import { onAuthStateChanged } from "firebase/auth";

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔥 TEMPORARY DUMMY ORDER DATA (since Firebase disabled)
  const dummyOrders = [
    {
      id: "DUMMY-ORDER-001",
      createdAt: { toDate: () => new Date() },
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

    // ============================================================
    // 🚫 FIREBASE DISABLED — KEEPING THE CODE COMMENTED FOR FUTURE
    // ============================================================

    /*
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        setOrders([]);
        setLoading(false);
        return;
      }

      const sortedQuery = query(
        collection(db, "orders"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc")
      );

      const unsubOrders = onSnapshot(sortedQuery, (snap) => {
        let list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        setOrders(list);
        setLoading(false);
      });

      return () => unsubOrders();
    });

    return () => unsubscribe();
    */

    // ⭐ Temporary: simulate Firebase delay
    setTimeout(() => {
      setOrders(dummyOrders);
      setLoading(false);
    }, 800);
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
                <span>{order.createdAt?.toDate().toLocaleString()}</span>
              </div>

              <div className="order-items">
                {order.items.map((item, i) => (
                  <div key={i} className="order-item">
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

              <div className="order-total">
                Total: ₹{order.total}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
