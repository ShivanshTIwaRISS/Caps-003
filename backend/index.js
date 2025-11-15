import express from 'express';
import jwt from 'jsonwebtoken';
import cors from 'cors';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';
import 'dotenv/config';

dotenv.config();
const prisma = new PrismaClient();
const app = express();


const allowedOrigins = [
  "https://caps-003.vercel.app",
  "http://localhost:5173"
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true,
  methods: "GET,POST,PUT,DELETE,OPTIONS",
  allowedHeaders: "Content-Type, Authorization"
}));

app.options("*", cors());



app.use(express.json());

app.get('/', (req, res) => {
    res.send('Backend is running successfully.');
});


app.post('/signup', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const existingUser = await prisma.user.findUnique({ where: { email } });

        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id } });

        res.status(201).json({ accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email , createdAt: user.createdAt , updatedAt: user.updatedAt} });
    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


app.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Missing email or password' });
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) return res.status(401).json({ message: 'Invalid credentials' });

        const accessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
        const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        await prisma.refreshToken.create({ data: { token: refreshToken, userId: user.id } });

        res.json({ accessToken, refreshToken, user: { id: user.id, name: user.name, email: user.email , createdAt: user.createdAt , updatedAt: user.updatedAt } });
    } catch (err) {
        console.error('Login error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


app.post('/refresh', async (req, res) => {
    try {
        const { refreshToken } = req.body;
        if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

        const storedToken = await prisma.refreshToken.findUnique({ where: { token: refreshToken } });
        if (!storedToken) return res.status(403).json({ message: 'Invalid refresh token' });

        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: 'Refresh token expired' });
            const newAccessToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '15m' });
            res.json({ accessToken: newAccessToken });
        });

    } catch (err) {
        console.error('Refresh error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ message: 'No token provided' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ message: 'Invalid token' });
        req.user = user;
        next();
    });
};


app.get('/users', authenticateToken, async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: { id: true, name: true, email: true }
        });
        res.json(users);
    } catch (err) {
        console.error('Get users error:', err);
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});


app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});


// https://caps-003.vercel.app/