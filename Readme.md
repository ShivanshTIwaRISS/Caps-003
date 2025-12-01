# 🛒 OS E-Commerce 
Node.js • Express • Prisma • MySQL • JWT • Render Deployment

This backend powers the **Caps-003** eCommerce application.  
Includes authentication, cart CRUD, order management, Prisma ORM, secure CORS, and JWT token-based authorization.

---

# 🌐 Live URLs

### ✔️ Frontend (Vercel)
https://caps-003.vercel.app

### ✔️ Backend (Render)
https://caps-003.onrender.com

---

# 🗄 Database Hosting (AIVEN MySQL)

This project uses **Aiven MySQL** as the cloud database provider.

- Fully managed MySQL  
- Remote connection via SSL  
- Connection string stored in `.env`  
- Prisma ORM handles migrations  

### The `DATABASE_URL` in `.env` looks like:

```
mysql://USER:PASSWORD@HOST:PORT/DATABASE?ssl-mode=REQUIRED
```

⚠️ **Database URL must NEVER be committed to GitHub.**

---

# ⚙️ Technologies Used

- Node.js  
- Express.js  
- Prisma ORM  
- **Aiven MySQL (Database)**  
- JWT Authentication  
- Bcrypt Password Hashing  
- Render (Backend Hosting)  
- Vercel (Frontend Hosting)  
- CORS Protection  

---

# 📦 Installation

## 1️⃣ Install dependencies
```bash
npm install
```

## 2️⃣ Generate Prisma client
```bash
npx prisma generate
```

## 3️⃣ Apply migrations
```bash
npx prisma migrate deploy
```

## 4️⃣ Start server
```bash
npm start
```

---

# 🔧 Environment Variables (`.env`)

```env
DATABASE_URL="mysql://USER:PASSWORD@AIVEN-HOST:PORT/DATABASE?ssl-mode=REQUIRED"
JWT_SECRET="your-access-secret"
REFRESH_TOKEN_SECRET="your-refresh-secret"
PORT=5000
```

---

# 🔥 Complete API Documentation

Below is the **full list of API endpoints** for Auth, Cart, and Orders.

---

# 🟦 AUTH APIs

---

### ▶️ Signup  
**POST** `/signup`  
**Body:**
```json
{
  "name": "John",
  "email": "john@gmail.com",
  "password": "123456"
}
```

---

### ▶️ Login  
**POST** `/login`

**Body:**
```json
{
  "email": "john@gmail.com",
  "password": "123456"
}
```

Returns accessToken + refreshToken.

---

### ▶️ Refresh Access Token  
**POST** `/refresh`  
**Body:**
```json
{ "refreshToken": "..." }
```

---

### ▶️ Logout  
**POST** `/logout`  
**Body:**
```json
{ "refreshToken": "..." }
```

---

# 🟩 CART APIs (FULL CRUD)

> All Cart routes require:  
```
Authorization: Bearer <accessToken>
```

---

### ▶️ Get Cart Items  
**GET** `/cart`

---

### ▶️ Add Item to Cart  
**POST** `/cart/add`

**Body:**
```json
{
  "productId": 5,
  "title": "Laptop",
  "price": 49999,
  "thumbnail": "img-url"
}
```

---

### ▶️ Update Cart Item (PUT)  
**PUT** `/cart/update/:cartItemId`

**Body:**
```json
{
  "quantity": 3
}
```

---

### ▶️ Remove a Cart Item  
**DELETE** `/cart/remove/:cartItemId`

---

### ▶️ Clear Entire Cart  
**DELETE** `/cart/clear`

---

# 🟧 ORDER APIs

---

### ▶️ Place Order  
**POST** `/orders/place`

---

### ▶️ Get All Orders  
**GET** `/orders`

---

# 🗄 Prisma Schema (MySQL + AIVEN)

```prisma
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
```

---

# 🌍 CORS Configuration (Render + Vercel Safe)

```js
const allowedOrigins = [
  "https://caps-003.vercel.app",
  "http://localhost:5173"
];
```

---

# 🧪 Postman Testing Flow

1. Login → Get accessToken  
2. Set header  
```
Authorization: Bearer <token>
```
3. Test all APIs:
   - `/cart`
   - `/cart/add`
   - `/cart/update/:id`
   - `/cart/remove/:id`
   - `/orders/place`

---

# Developer  
**Shivansh Tiwari**  


