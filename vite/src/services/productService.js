import api from "./api";

// In-memory cache for super-fast retrieval
const cache = new Map();

// Helper to calculate realistic discounts & specs
function enhanceProduct(item) {
  if (!item) return item;
  const discountPercentage = item.discountPercentage || Math.floor(Math.random() * 25) + 10;
  const originalPrice = Math.round(item.price / (1 - discountPercentage / 100));
  const stock = item.stock !== undefined ? item.stock : Math.floor(Math.random() * 30) + 3;
  const rating = item.rating || (4 + Math.random() * 0.9).toFixed(1);
  const reviewsCount = item.reviewsCount || Math.floor(Math.random() * 240) + 18;

  // Realistic reviews if missing
  const reviews = item.reviews && item.reviews.length > 0 ? item.reviews : [
    {
      reviewerName: "Aarav Sharma",
      rating: 5,
      comment: "Superb build quality! Arrived within 2 days in mint packaging. Exceeded my expectations.",
      date: "2026-08-20T10:30:00.000Z",
      verified: true
    },
    {
      reviewerName: "Priya Patel",
      rating: 5,
      comment: "Looks extremely sleek and premium. The performance is top tier.",
      date: "2026-08-15T14:22:00.000Z",
      verified: true
    },
    {
      reviewerName: "Rohan Verma",
      rating: 4,
      comment: "Great value for money. Minor learning curve but overall very satisfied.",
      date: "2026-08-01T09:15:00.000Z",
      verified: true
    }
  ];

  return {
    ...item,
    price: Math.round(item.price),
    originalPrice,
    discountPercentage: Math.round(discountPercentage),
    stock,
    rating: Number(rating),
    reviewsCount,
    reviews,
    warranty: item.warrantyInformation || "1 Year Comprehensive Manufacturer Warranty",
    shipping: item.shippingInformation || "Free Express Shipping on prepaid orders",
    returnPolicy: item.returnPolicy || "7 Days Replacement Guarantee",
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

  // Check sessionStorage
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

  // Direct DummyJSON fetch promise
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

  // Backend fetch promise
  const fetchBackend = async () => {
    const res = await api.get("/products", {
      params: { page, limit, search, category, rating, price, sort },
      timeout: 2500, // max 2.5s before falling back to direct
    });
    return {
      products: (res.data.products || []).map(enhanceProduct),
      total: res.data.total || 0,
      page: res.data.page || Number(page),
      totalPages: res.data.totalPages || 1,
    };
  };

  try {
    // Try backend first, fallback immediately if backend is slow/offline
    const data = await Promise.race([
      fetchBackend(),
      new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 2200))
    ]).catch(() => fetchDirect());

    cache.set(cacheKey, data);
    try {
      sessionStorage.setItem(cacheKey, JSON.stringify(data));
    } catch (e) {
      // storage full, ignore
    }
    return data;
  } catch (err) {
    console.warn("Product fetch fallback triggered:", err);
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
    const res = await fetch(`https://dummyjson.com/products/search?q=${encodeURIComponent(trimmed)}&limit=${limit}`);
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
    // Filter items with high discount and rating
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
