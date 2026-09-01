import api from "./api";

// In-memory cache for zero-buffering retrieval
const cache = new Map();

// Helper to convert prices into authentic, realistic Indian Rupees (₹)
function calculateRealisticInrPrice(rawPrice, category = "") {
  const cat = (category || "").toLowerCase();
  let multiplier = 75; // standard tech conversion

  if (cat.includes("laptop")) {
    multiplier = 95; // laptops in India: ₹45,000 - ₹1,40,000
  } else if (cat.includes("smart") || cat.includes("phone")) {
    multiplier = 85; // phones in India: ₹14,999 - ₹89,999
  } else if (cat.includes("fragrance") || cat.includes("beauty")) {
    multiplier = 50; // fragrances: ₹1,299 - ₹4,999
  } else if (cat.includes("grocer")) {
    multiplier = 25; // groceries: ₹149 - ₹799
  } else if (cat.includes("shoe") || cat.includes("footwear")) {
    multiplier = 55; // shoes: ₹2,499 - ₹7,999
  }

  let inrPrice = Math.round(Number(rawPrice) * multiplier);

  // Apply clean psychological retail pricing endings (e.g. 99, 499, 999)
  if (inrPrice > 10000) {
    inrPrice = Math.floor(inrPrice / 1000) * 1000 + 999;
  } else if (inrPrice > 1000) {
    inrPrice = Math.floor(inrPrice / 100) * 100 + 99;
  } else if (inrPrice > 200) {
    inrPrice = Math.floor(inrPrice / 50) * 50 + 49;
  } else {
    inrPrice = Math.max(149, inrPrice);
  }

  return inrPrice;
}

// Helper to enhance product with realistic specs and verified reviews (NO emojis)
function enhanceProduct(item) {
  if (!item) return item;

  const inrPrice = calculateRealisticInrPrice(item.price, item.category);
  const discountPercentage = item.discountPercentage
    ? Math.round(item.discountPercentage)
    : Math.floor(Math.random() * 20) + 12;

  const originalPrice = Math.round(inrPrice / (1 - discountPercentage / 100));
  const stock = item.stock !== undefined ? item.stock : Math.floor(Math.random() * 25) + 4;
  const rating = Number(item.rating || (4.2 + Math.random() * 0.7).toFixed(1));
  const reviewsCount = item.reviewsCount || Math.floor(Math.random() * 180) + 24;

  const cleanReviews = item.reviews && item.reviews.length > 0
    ? item.reviews.map((r) => ({
        reviewerName: r.reviewerName || "Verified Customer",
        rating: r.rating || 5,
        comment: (r.comment || "").replace(/[\u{1F600}-\u{1F6FF}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, "").trim() || "Excellent build quality and timely delivery. Completely satisfied with the purchase.",
        date: r.date || "2026-08-15T12:00:00.000Z",
        verified: true,
      }))
    : [
        {
          reviewerName: "Aarav Sharma",
          rating: 5,
          comment: "Authentic item with brand warranty. Packaging was pristine and delivered in 2 business days.",
          date: "2026-08-20T10:30:00.000Z",
          verified: true,
        },
        {
          reviewerName: "Priya Patel",
          rating: 5,
          comment: "High performance and premium finish. Exact match to the specifications.",
          date: "2026-08-15T14:22:00.000Z",
          verified: true,
        },
        {
          reviewerName: "Rohan Verma",
          rating: 4,
          comment: "Great value for money. Prompt support and smooth checkout experience.",
          date: "2026-08-01T09:15:00.000Z",
          verified: true,
        },
      ];

  return {
    ...item,
    price: inrPrice,
    originalPrice,
    discountPercentage,
    stock,
    rating,
    reviewsCount,
    reviews: cleanReviews,
    warranty: item.warrantyInformation || "1 Year Official Manufacturer Brand Warranty",
    shipping: item.shippingInformation || "Free Express Shipping on prepaid and COD orders",
    returnPolicy: item.returnPolicy || "7 Days Replacement & Refund Guarantee",
  };
}

// Resilient product fetcher with 2-second timeout fallback
export async function getProducts({
  page = 1,
  limit = 20,
  search = "",
  category = "all",
  rating = "",
  price = "",
  sort = "",
} = {}) {
  const cacheKey = `products_${page}_${limit}_${search}_${category}_${rating}_${price}_${sort}`;

  if (cache.has(cacheKey)) {
    return cache.get(cacheKey);
  }

  const sessionCached = sessionStorage.getItem(cacheKey);
  if (sessionCached) {
    try {
      const parsed = JSON.parse(sessionCached);
      cache.set(cacheKey, parsed);
      return parsed;
    } catch (e) {
      sessionStorage.removeItem(cacheKey);
    }
  }

  const skip = (page - 1) * limit;

  const fetchDirect = async () => {
    let url = `https://dummyjson.com/products?limit=${limit}&skip=${skip}`;
    if (search) {
      url = `https://dummyjson.com/products/search?q=${encodeURIComponent(search)}&limit=${limit}&skip=${skip}`;
    } else if (category && category !== "all") {
      url = `https://dummyjson.com/products/category/${category.toLowerCase()}`;
    }

    const res = await fetch(url);
    if (!res.ok) throw new Error("Direct fetch failed");
    const data = await res.json();

    let items = (data.products || []).map(enhanceProduct);

    if (rating) items = items.filter((p) => p.rating >= Number(rating));
    if (price === "low" || sort === "price-asc") items.sort((a, b) => a.price - b.price);
    if (price === "high" || sort === "price-desc") items.sort((a, b) => b.price - a.price);
    if (sort === "rating") items.sort((a, b) => b.rating - a.rating);
    if (sort === "discount") items.sort((a, b) => b.discountPercentage - a.discountPercentage);

    const total = data.total || items.length;
    const totalPages = Math.ceil(total / limit) || 1;

    return {
      products: items,
      total,
      page: Number(page),
      totalPages,
    };
  };

  const fetchBackend = async () => {
    const res = await api.get("/products", {
      params: { page, limit, search, category, rating, price, sort },
      timeout: 2500,
    });
    return {
      products: (res.data.products || []).map(enhanceProduct),
      total: res.data.total || 0,
      page: res.data.page || Number(page),
      totalPages: res.data.totalPages || 1,
    };
  };

  try {
    const data = await Promise.race([
      fetchBackend(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2200)),
    ]).catch(() => fetchDirect());

    cache.set(cacheKey, data);
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (e) {}
    return data;
  } catch (err) {
    const directData = await fetchDirect();
    cache.set(cacheKey, directData);
    return directData;
  }
}

// Single Product Fetcher
export async function getProductById(id) {
  const cacheKey = `product_detail_${id}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const res = await fetch(`https://dummyjson.com/products/${id}`);
    if (!res.ok) throw new Error("Failed to load product");
    const data = await res.json();
    const enhanced = enhanceProduct(data);
    cache.set(cacheKey, enhanced);
    return enhanced;
  } catch (err) {
    console.error("getProductById error:", err);
    throw err;
  }
}

// Fast Search Suggestions
export async function getSearchSuggestions(query, limit = 6) {
  if (!query || !query.trim()) return [];
  const trimmed = query.trim();
  const cacheKey = `suggest_${trimmed}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const res = await fetch(
      `https://dummyjson.com/products/search?q=${encodeURIComponent(trimmed)}&limit=${limit}`
    );
    const data = await res.json();
    const results = (data.products || []).map(enhanceProduct);
    cache.set(cacheKey, results);
    return results;
  } catch (err) {
    return [];
  }
}

// Flash Deals & Trending
export async function getFlashDeals(limit = 6) {
  const cacheKey = `flash_deals_${limit}`;
  if (cache.has(cacheKey)) return cache.get(cacheKey);

  try {
    const res = await fetch(`https://dummyjson.com/products?limit=30`);
    const data = await res.json();
    const enhanced = (data.products || []).map(enhanceProduct);
    const deals = enhanced
      .sort((a, b) => b.discountPercentage - a.discountPercentage)
      .slice(0, limit);
    cache.set(cacheKey, deals);
    return deals;
  } catch (err) {
    return [];
  }
}
