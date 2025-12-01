# 🛒 Caps-003 Backend (Node.js + Express + Prisma + JWT + MySQL)

This is the backend for the **Caps-003** eCommerce application, built with:

- Node.js + Express  
- Prisma ORM  
- MySQL Database  
- JWT Authentication (Access + Refresh Tokens)  
- Secure CORS (for Render + Vercel deployment)  
- Cart CRUD (Add, Read, Update, Delete)  
- Order Management  
- Deployed on Render  

---

##  Features

### Authentication
- User Signup  
- User Login  
- Protected Routes using JWT  
- Access Token (15 min)  
- Refresh Token (7 days) + Storage in DB  
- Logout + Refresh Token Deletion  
- Refresh Access Tokens safely  

---

### 🛒 Cart Features (Full CRUD)
- Add items to cart  
- Fetch cart items  
- Update quantity (PUT) ✔  
- Remove single item  
- Clear cart completely  

---

### 📦 Orders
- Create an order from cart  
- Move cart items into order items  
- Clear cart after checkout  
- Fetch all orders of the user  

---

## 🗂 Folder Structure

backend/
│── index.js # Main server file
│── prisma/
│ └── schema.prisma
│── package.json
│── .env

yaml


---

## ⚙️ Tech Used

| Technology | Purpose |
|-----------|----------|
| **Express.js** | API server |
| **Prisma ORM** | DB mapping (MySQL) |
| **JWT** | Authentication |
| **bcrypt** | Password hashing |
| **CORS** | Vercel + Render safe CORS |
| **MySQL** | Database |
| **Render** | Backend hosting |

---

## 🔧 Environment Variables (Required)

Create a `.env` file:

```env
DATABASE_URL="mysql://USER:PASSWORD@HOST:PORT/DATABASE"
JWT_SECRET="your-access-secret"
REFRESH_TOKEN_SECRET="your-refresh-secret"
PORT=5000
📌 Install & Run
1️⃣ Install Dependencies
bash

npm install
2️⃣ Generate Prisma Client
bash

npx prisma generate
3️⃣ Run Migrations
bash

npx prisma migrate deploy
4️⃣ Start Server
bash

npm start
🔒 Authentication Endpoints
Signup
POST /signup

json

{
  "name": "John Doe",
  "email": "john@gmail.com",
  "password": "123456"
}
Login
POST /login
Returns:

json

{
  "accessToken": "...",
  "refreshToken": "...",
  "user": { ... }
}
Refresh Token
POST /refresh

json

{ "refreshToken": "xxx" }
Logout
POST /logout

json

{ "refreshToken": "xxx" }
🛒 Cart Routes (CRUD)
✔ Get Cart Items
GET /cart

✔ Add Item
POST /cart/add

json

{
  "productId": 1,
  "title": "Laptop",
  "price": 49999,
  "thumbnail": "img-url"
}
✔ Update Cart Item (PUT)
PUT /cart/update/:id

json

{
  "quantity": 3
}
✔ Remove a Cart Item
DELETE /cart/remove/:id

✔ Clear All Cart Items
DELETE /cart/clear

📦 Orders
✔ Place Order
POST /orders/place

✔ Get All Orders
GET /orders

🔐 Authentication Middleware
All protected routes use:

makefile

Authorization: Bearer <token>
⚠️ CORS Setup (Render + Vercel Safe)
js

const allowedOrigins = [
  "https://caps-003.vercel.app",
  "http://localhost:5173"
];

cors({
  origin: (origin, cb) => {
    if (!origin || allowedOrigins.includes(origin)) cb(null, true);
    else cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
});
🗄 Prisma Models (MySQL)
prisma

model User {
  id            Int            @id @default(autoincrement())
  email         String         @unique
  name          String
  password      String
  refreshTokens RefreshToken[]
  carts         Cart[]
  orders        Order[]
  createdAt     DateTime       @default(now())
  updatedAt     DateTime       @updatedAt
}

model Cart {
  id     Int        @id @default(autoincrement())
  userId Int        @unique 
  user   User       @relation(fields: [userId], references: [id])
  items  CartItem[]
}

model CartItem {
  id        Int    @id @default(autoincrement())
  cartId    Int
  productId Int
  title     String
  price     Float
  thumbnail String
  quantity  Int    @default(1)

  cart Cart @relation(fields: [cartId], references: [id], onDelete: Cascade)
}
🧪 Postman Testing Guide
1. Login → get accessToken
2. GET /cart → find cartItemId
3. PUT /cart/update/:id → update quantity
4. DELETE /cart/remove/:id
5. POST /orders/place


Developer
Shivansh Tiwari
Backend + Full-Stack Developer