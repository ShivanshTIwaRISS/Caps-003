import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const WishlistContext = createContext();

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}

export function WishlistProvider({ children }) {
  const navigate = useNavigate();

  const [wishlistItems, setWishlistItems] = useState(() => {
    try {
      const stored = localStorage.getItem("user_wishlist");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("user_wishlist", JSON.stringify(wishlistItems));
    } catch (e) {}
  }, [wishlistItems]);

  const isLoggedIn = () => {
    return !!localStorage.getItem("user");
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => (item.id || item.productId) === productId);
  };

  const toggleWishlist = (product) => {
    if (!isLoggedIn()) {
      alert("Please sign in to save products to your Wishlist.");
      navigate("/login");
      return false;
    }

    const pId = product.id || product.productId;
    const exists = isInWishlist(pId);

    if (exists) {
      setWishlistItems((prev) => prev.filter((i) => (i.id || i.productId) !== pId));
    } else {
      setWishlistItems((prev) => [
        ...prev,
        {
          id: pId,
          productId: pId,
          title: product.title,
          price: product.price,
          originalPrice: product.originalPrice,
          thumbnail: product.thumbnail,
          rating: product.rating,
          category: product.category,
        },
      ]);
    }
    return true;
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems((prev) => prev.filter((i) => (i.id || i.productId) !== productId));
  };

  const clearWishlist = () => {
    setWishlistItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        totalWishlistItems: wishlistItems.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
