import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  // ✅ Allow all origins for now (CORS fix)
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.status(200).end(); // Handle preflight
  }

  try {
    const { pathname } = new URL(req.url, `http://${req.headers.host}`);
    const method = req.method;

    // ✅ Root route (optional check)
    if (pathname === "/api" || pathname === "/api/") {
      return res.status(200).json({ message: "API is running 🚀" });
    }

    // ✅ SIGNUP
    if (pathname === "/api/signup" && method === "POST") {
      const { name, email, password } = req.body;

      if (!name || !email || !password)
        return res.status(400).json({ message: "Missing required fields" });

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing)
        return res.status(400).json({ message: "User already exists" });

      const hashed = await bcrypt.hash(password, 10);
      const user = await prisma.user.create({
        data: { name, email, password: hashed },
      });

      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

      await prisma.refreshToken.create({
        data: { token: refreshToken, userId: user.id },
      });

      return res.status(201).json({
        accessToken,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email },
      });
    }

    // ✅ LOGIN
    if (pathname === "/api/login" && method === "POST") {
      const { email, password } = req.body;

      if (!email || !password)
        return res.status(400).json({ message: "Missing email or password" });

      const user = await prisma.user.findUnique({ where: { email } });
      if (!user) return res.status(401).json({ message: "Invalid credentials" });

      const valid = await bcrypt.compare(password, user.password);
      if (!valid) return res.status(401).json({ message: "Invalid credentials" });

      const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "15m" });
      const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

      await prisma.refreshToken.create({
        data: { token: refreshToken, userId: user.id },
      });

      return res.status(200).json({
        accessToken,
        refreshToken,
        user: { id: user.id, name: user.name, email: user.email },
      });
    }

    // ✅ REFRESH TOKEN
    if (pathname === "/api/refresh" && method === "POST") {
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

        const newAccess = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
          expiresIn: "15m",
        });

        return res.status(200).json({ accessToken: newAccess });
      });
      return;
    }

    // ✅ GET USERS (Protected)
    if (pathname === "/api/users" && method === "GET") {
      const authHeader = req.headers["authorization"];
      const token = authHeader && authHeader.split(" ")[1];

      if (!token) return res.status(401).json({ message: "No token provided" });

      jwt.verify(token, process.env.JWT_SECRET, async (err) => {
        if (err) return res.status(403).json({ message: "Invalid token" });

        const users = await prisma.user.findMany({
          select: { id: true, name: true, email: true },
        });
        return res.status(200).json(users);
      });
      return;
    }

    // ❌ Not Found
    return res.status(404).json({ message: "Route not found" });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ message: "Server error", error: err.message });
  }
}
