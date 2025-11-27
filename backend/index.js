import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import "./pinger.js";

dotenv.config();
const prisma = new PrismaClient();
const app = express();

/* ====================================
   🌟 REAL CORS FIX (Render + Vercel)
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

// ⭐ Required for preflight
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

    const exists = await prisma.user.findUnique({ where: { email } });
    if (exists)
      return res.status(400).json({ message: "User already exists" });

    const hash = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: { name, email, password: hash },
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
      data: { token: refreshToken, userId: user.id },
    });

    res.json({ accessToken, refreshToken, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ====================================
   LOGIN
   ==================================== */
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });
    const refreshToken = jwt.sign(
      { id: user.id },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    await prisma.refreshToken.create({
      data: { token: refreshToken, userId: user.id },
    });

    res.json({ accessToken, refreshToken, user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ====================================
   JWT MIDDLEWARE
   ==================================== */
const authenticateToken = (req, res, next) => {
  if (req.method === "OPTIONS") return res.sendStatus(200);

  const auth = req.headers["authorization"];
  if (!auth) return res.status(401).json({ message: "No token" });

  const token = auth.split(" ")[1];

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Invalid token" });

    req.user = { id: decoded.id };
    next();
  });
};

/* ====================================
   CART
   ==================================== */
app.post("/cart/add", authenticateToken, async (req, res) => {
  const { productId, title, price, thumbnail } = req.body;
  const userId = req.user.id;

  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) cart = await prisma.cart.create({ data: { userId } });

  const existing = await prisma.cartItem.findFirst({
    where: { cartId: cart.id, productId },
  });

  if (existing) {
    await prisma.cartItem.update({
      where: { id: existing.id },
      data: { quantity: existing.quantity + 1 },
    });
  } else {
    await prisma.cartItem.create({
      data: { cartId: cart.id, productId, title, price, thumbnail, quantity: 1 },
    });
  }

  res.json({ message: "Added to cart" });
});

app.get("/cart", authenticateToken, async (req, res) => {
  const cart = await prisma.cart.findUnique({
    where: { userId: req.user.id },
    include: { items: true },
  });
  res.json(cart ? cart.items : []);
});

app.delete("/cart/remove/:id", authenticateToken, async (req, res) => {
  await prisma.cartItem.delete({ where: { id: Number(req.params.id) } });
  res.json({ message: "Item removed" });
});

app.delete("/cart/clear", authenticateToken, async (req, res) => {
  await prisma.cartItem.deleteMany({
    where: { cart: { userId: req.user.id } },
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
    include: { items: true },
  });

  if (!cart || cart.items.length === 0)
    return res.status(400).json({ message: "Cart empty" });

  const total = cart.items.reduce(
    (sum, i) => sum + i.price * i.quantity,
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

  await prisma.cartItem.deleteMany({
    where: { cartId: cart.id },
  });

  res.json({ message: "Order placed", order });
});

app.get("/orders", authenticateToken, async (req, res) => {
  const orders = await prisma.order.findMany({
    where: { userId: req.user.id },
    include: { items: true },
  });

  res.json(orders);
});

/* ====================================
   START SERVER
   ==================================== */
app.listen(process.env.PORT || 8085, () =>
  console.log("Server running on port " + (process.env.PORT || 8085))
);
