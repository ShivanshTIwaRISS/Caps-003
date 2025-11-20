import React from "react";

const StorePreview = () => {
  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Store Preview</h2>

      <div style={styles.card}>
        <img
          src="https://via.placeholder.com/200"
          alt="Product"
          style={styles.image}
        />
        <h3 style={styles.productName}>Sample Product</h3>
        <p style={styles.description}>
          This is a dummy product description to showcase the preview layout.
        </p>

        <div style={styles.priceRow}>
          <span style={styles.price}>₹499</span>
          <button style={styles.button}>Buy Now</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  container: {
    padding: "20px",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  card: {
    width: "250px",
    margin: "0 auto",
    padding: "15px",
    borderRadius: "12px",
    background: "#f5f5f5",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  image: {
    width: "100%",
    borderRadius: "10px",
  },
  productName: {
    margin: "10px 0",
  },
  description: {
    fontSize: "14px",
    color: "#555",
  },
  priceRow: {
    marginTop: "15px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },
  price: {
    fontWeight: "bold",
    fontSize: "18px",
  },
  button: {
    padding: "6px 12px",
    border: "none",
    borderRadius: "6px",
    background: "#007bff",
    color: "#fff",
    cursor: "pointer",
  },
};

export default StorePreview;
