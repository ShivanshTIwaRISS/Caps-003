import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import "dotenv/config";


dotenv.config();
const prisma = new PrismaClient();
const app = express();

/* ====================================
   REAL CORS FIX FOR RENDER + VERCEL
   ==================================== */

const allowedOrigins = [
  "https://caps-003.vercel.app",
  "http://localhost:5173",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.options("*", cors());
app.use(express.json());


app.get("/", (req, res) => {
  res.send("Backend is running successfully.");
});

/* ====================================
   SIGNUP
   ==================================== */
app.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing required fields" });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hashedPassword }
    });

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id }
    });

    res.status(201).json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ====================================
   LOGIN
   ==================================== */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Missing email or password" });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id }
    });

    res.json({
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ====================================
   LOGOUT
   ==================================== */
app.post("/logout", async (req, res) => {
  try {
    const { refreshToken } = req.body;

    await prisma.refreshToken.deleteMany({
      where: { token: refreshToken },
    });

    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ====================================
   REFRESH TOKEN
   ==================================== */
app.post("/refresh", async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken)
      return res.status(401).json({ message: "No refresh token provided" });

    const stored = await prisma.refreshToken.findUnique({
      where: { token: refreshToken },
    });

    if (!stored)
      return res.status(403).json({ message: "Invalid refresh token" });

    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
      if (err)
        return res.status(403).json({ message: "Refresh token expired" });

      const newAccessToken = jwt.sign(
        { id: user.id },
        process.env.JWT_SECRET,
        { expiresIn: "15m" }
      );

      res.json({ accessToken: newAccessToken });
    });
  } catch (err) {
    console.error("Refresh error:", err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
});

/* ====================================
   AUTH MIDDLEWARE
   ==================================== */
const authenticateToken = (req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(200);

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token)
    return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err)
      return res.status(403).json({ message: "Invalid token" });

    req.user = { id: payload.id };
    next();
  });
};

/* ====================================
   CART
   ==================================== */

app.post("/cart/add", authenticateToken, async (req, res) => {
  try{

  const userId = req.user.id;
  const { productId, title, price, thumbnail } = req.body;

  let cart = await prisma.cart.findUnique({ where: { userId } });

  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  const existingItem = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId }
  });

  if (existingItem) {
    await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: existingItem.quantity + 1 }
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, title, price, thumbnail, quantity: 1 }
    });
  }

  res.json({ message: "Added to cart" });
} catch (err) {
  console.error("Add to cart error:", err);
  res.status(500).json({ message: "Server error", error: err.message });
}
});

app.get("/cart", authenticateToken, async (req, res) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
    include: { items: true }
  });

  res.json(cart ? cart.items : []);
});

app.delete("/cart/remove/:id", authenticateToken, async (req, res) => {
  await prisma.cartItem.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Item removed" });
});

app.delete("/cart/clear", authenticateToken, async (req, res) => {
  await prisma.cartItem.deleteMany({
    where: { cart: { userId: req.user.id } }
  });
  res.json({ message: "Cart cleared" });
});

/* ====================================
   ORDERS
   ==================================== */

app.post("/orders/place", authenticateToken, async (req, res) => {
  const userId = req.user.id;

  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: { items: true }
  });

  if (!cart || cart.items.length === 0)
    return res.status(400).json({ message: "Cart empty" });

  const total = cart.items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const order = await prisma.order.create({
    data: {
      userId,
      total,
      items: {
        create: cart.items.map((i) => ({
          productId: i.productId,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
          thumbnail: i.thumbnail,
        })),
      },
    },
    include: { items: true },
  });

  await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });

  res.json({ message: "Order placed!", order });
});

app.get("/orders", authenticateToken, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });

  res.json(orders);
});

/* ====================================
   START SERVER
   ==================================== */
app.listen(process.env.PORT || 5000, () => {
  console.log(`Server running on port ${process.env.PORT || 5000}`);
});