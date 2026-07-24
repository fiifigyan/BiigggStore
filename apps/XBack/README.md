🚀 XBackbone - Complete API Documentation
📋 Table of Contents
Project Overview

Tech Stack

Installation & Setup

Project Structure

Environment Variables

Database Schema

API Endpoints

Authentication & Authorization

Error Handling

Testing

Deployment

Troubleshooting

📖 Project Overview
XBackbone is a production-ready RESTful API backend for the XStore e-commerce mobile application. It provides complete e-commerce functionality including user authentication, product management, shopping cart, order processing, and user profile management.

Key Features
🔐 JWT Authentication - Secure user authentication and authorization

🛍️ Product Management - CRUD operations, search, filtering, and categorization

🛒 Shopping Cart - Add, update, and remove items with persistence

📦 Order Processing - Create orders, track status, and manage history

👤 User Profiles - Profile management with multiple shipping addresses

🗄️ PostgreSQL Database - Reliable data persistence with Prisma ORM

🛡️ Security - Helmet.js, rate limiting, and CORS configuration

🛠️ Tech Stack
Category	Technology	Version
Runtime	Node.js	v18+
Framework	Express.js	4.18.0
Language	TypeScript	5.0.0
ORM	Prisma	6.19.0
Database	PostgreSQL	15
Authentication	JWT (jsonwebtoken)	9.0.0
Password Hashing	bcryptjs	2.4.3
Validation	Custom middleware	-
Security	Helmet, CORS, Rate Limit	7.1.0
📦 Installation & Setup
Prerequisites
Node.js v18 or higher

PostgreSQL 15 or higher (or Docker)

npm or yarn

Step 1: Clone & Install
bash
# Navigate to the apps directory
cd ~/Desktop/BiigggStore/apps

# Install dependencies
cd xbackbone
npm install
Step 2: Configure Environment
Create a .env file in the root directory:

env
# Server Configuration
PORT=9000
NODE_ENV=development

# Database
DATABASE_URL=postgres://postgres:postgres@localhost:5432/biigggstore

# JWT Authentication
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d

# CORS
CORS_ORIGIN=http://localhost:8081
Step 3: Setup Database
bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed with sample data (optional)
npm run db:seed
Step 4: Start the Server
bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm run build
npm start
📁 Project Structure
text
xbackbone/
├── src/
│   ├── api/
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   └── auth.service.ts
│   │   ├── cart/
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.routes.ts
│   │   │   └── cart.service.ts
│   │   ├── orders/
│   │   │   ├── order.controller.ts
│   │   │   ├── order.routes.ts
│   │   │   └── order.service.ts
│   │   ├── products/
│   │   │   ├── product.controller.ts
│   │   │   ├── product.routes.ts
│   │   │   └── product.service.ts
│   │   └── users/
│   │       ├── user.controller.ts
│   │       ├── user.routes.ts
│   │       └── user.service.ts
│   ├── lib/
│   │   └── prisma.ts
│   ├── middleware/
│   │   ├── auth.ts
│   │   ├── errorHandler.ts
│   │   └── validation.ts
│   ├── utils/
│   │   ├── jwt.ts
│   │   └── password.ts
│   ├── types/
│   │   └── index.ts
│   └── index.ts
├── prisma/
│   ├── schema.prisma
│   └── seed.ts
├── .env
├── package.json
├── tsconfig.json
└── nodemon.json
🌍 Environment Variables
Variable	Description	Required	Default
PORT	Server port	No	9000
NODE_ENV	Environment mode	No	development
DATABASE_URL	PostgreSQL connection string	Yes	-
JWT_SECRET	Secret for JWT signing	Yes	-
JWT_EXPIRES_IN	Token expiration	No	7d
CORS_ORIGIN	Allowed origins (comma-separated)	No	http://localhost:8081
Generating a JWT_SECRET
bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
🗄️ Database Schema
Core Models
prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  firstName String?
  lastName  String?
  phone     String?
  avatar    String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  cart      Cart?
  orders    Order[]
  addresses Address[]
  reviews   Review[]
  wishlists Wishlist[]
}

model Product {
  id          String   @id @default(cuid())
  title       String
  description String?
  price       Int
  compareAt   Int?
  images      String[]
  category    String?
  subcategory String?
  stock       Int      @default(0)
  isPublished Boolean  @default(true)
  isFeatured  Boolean  @default(false)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  cartItems   CartItem[]
  orderItems  OrderItem[]
  reviews     Review[]
  wishlists   Wishlist[]
}

model Order {
  id          String      @id @default(cuid())
  orderNumber String      @unique
  userId      String
  items       OrderItem[]
  total       Int
  subtotal    Int
  tax         Int         @default(0)
  shipping    Int         @default(0)
  discount    Int         @default(0)
  status      String      @default("pending")
  paymentStatus String    @default("pending")
  address     Json
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}
📡 API Endpoints
🔐 Authentication
Register User
http
POST /api/auth/register
Request Body:

json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "firstName": "John",
  "lastName": "Doe",
  "phone": "+233501234567"
}
Response:

json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+233501234567"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
Login
http
POST /api/auth/login
Request Body:

json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
Response:

json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  },
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
Get Current User
http
GET /api/auth/me
Authorization: Bearer <token>
Response:

json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+233501234567",
    "avatar": null,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "addresses": []
  }
}
🛍️ Products
Get All Products
http
GET /api/products?limit=20&offset=0&category=clothes&search=leather&sort=price:asc
Query Parameters:

Parameter	Type	Description
limit	number	Items per page (default: 20)
offset	number	Pagination offset (default: 0)
category	string	Filter by category
subcategory	string	Filter by subcategory
search	string	Search in title/description
minPrice	number	Minimum price (in cents)
maxPrice	number	Maximum price (in cents)
sort	string	Sort field:order (e.g., price:asc)
Response:

json
{
  "success": true,
  "products": [
    {
      "id": "clx...",
      "title": "Premium Leather Jacket",
      "description": "High-quality genuine leather jacket",
      "price": 14999,
      "images": ["https://...jpg"],
      "category": "clothes",
      "stock": 50,
      "isPublished": true,
      "isFeatured": true
    }
  ],
  "total": 45,
  "limit": 20,
  "offset": 0,
  "totalPages": 3
}
Get Featured Products
http
GET /api/products/featured?limit=10
Search Products
http
GET /api/products/search?q=leather jacket
Get Categories
http
GET /api/products/categories
Get Product by ID
http
GET /api/products/:id
Response:

json
{
  "success": true,
  "product": {
    "id": "clx...",
    "title": "Premium Leather Jacket",
    "description": "High-quality genuine leather jacket...",
    "price": 14999,
    "images": ["https://...jpg"],
    "category": "clothes",
    "stock": 50,
    "isPublished": true,
    "isFeatured": true,
    "reviews": [
      {
        "id": "clx...",
        "rating": 5,
        "comment": "Amazing quality!",
        "user": {
          "firstName": "John",
          "lastName": "Doe"
        }
      }
    ]
  }
}
🛒 Cart (Authentication Required)
Get Cart
http
GET /api/cart
Authorization: Bearer <token>
Response:

json
{
  "success": true,
  "cart": {
    "id": "clx...",
    "userId": "clx...",
    "items": [
      {
        "id": "clx...",
        "productId": "clx...",
        "quantity": 2,
        "product": {
          "id": "clx...",
          "title": "Premium Leather Jacket",
          "price": 14999,
          "images": ["https://...jpg"]
        }
      }
    ]
  }
}
Add Item to Cart
http
POST /api/cart/items
Authorization: Bearer <token>
Request Body:

json
{
  "productId": "clx...",
  "quantity": 1
}
Update Quantity
http
PUT /api/cart/items/:itemId
Authorization: Bearer <token>
Request Body:

json
{
  "quantity": 3
}
Remove Item
http
DELETE /api/cart/items/:itemId
Authorization: Bearer <token>
Clear Cart
http
DELETE /api/cart/clear
Authorization: Bearer <token>
📦 Orders (Authentication Required)
Create Order
http
POST /api/orders
Authorization: Bearer <token>
Request Body:

json
{
  "address": {
    "address1": "123 Main St",
    "city": "Accra",
    "country": "GH",
    "postalCode": "233",
    "phone": "+233501234567"
  },
  "paymentId": "pay_xxx"
}
Response:

json
{
  "success": true,
  "order": {
    "id": "clx...",
    "orderNumber": "ORD-1704067200000-123",
    "userId": "clx...",
    "subtotal": 14999,
    "tax": 1500,
    "shipping": 500,
    "total": 16999,
    "status": "pending",
    "paymentStatus": "pending",
    "address": {
      "address1": "123 Main St",
      "city": "Accra"
    },
    "items": [
      {
        "productId": "clx...",
        "quantity": 1,
        "price": 14999,
        "product": {
          "title": "Premium Leather Jacket"
        }
      }
    ],
    "createdAt": "2026-01-01T00:00:00.000Z"
  }
}
Get User Orders
http
GET /api/orders
Authorization: Bearer <token>
Get Order by ID
http
GET /api/orders/:id
Authorization: Bearer <token>
Get Order Status
http
GET /api/orders/:id/status
Authorization: Bearer <token>
Response:

json
{
  "success": true,
  "status": {
    "id": "clx...",
    "status": "processing",
    "paymentStatus": "paid",
    "tracking": null,
    "updatedAt": "2026-01-01T00:00:00.000Z"
  }
}
Cancel Order
http
POST /api/orders/:id/cancel
Authorization: Bearer <token>
👤 Users (Authentication Required)
Get Profile
http
GET /api/users/profile
Authorization: Bearer <token>
Response:

json
{
  "success": true,
  "user": {
    "id": "clx...",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "phone": "+233501234567",
    "avatar": null,
    "createdAt": "2026-01-01T00:00:00.000Z",
    "updatedAt": "2026-01-01T00:00:00.000Z",
    "addresses": [
      {
        "id": "clx...",
        "address1": "123 Main St",
        "city": "Accra",
        "country": "GH",
        "postalCode": "233",
        "isDefault": true
      }
    ],
    "orders": [
      {
        "id": "clx...",
        "orderNumber": "ORD-1704067200000-123",
        "total": 16999,
        "status": "pending",
        "createdAt": "2026-01-01T00:00:00.000Z"
      }
    ]
  }
}
Update Profile
http
PUT /api/users/profile
Authorization: Bearer <token>
Request Body:

json
{
  "firstName": "John",
  "lastName": "Smith",
  "phone": "+233501234568",
  "avatar": "https://...jpg"
}
Get Addresses
http
GET /api/users/addresses
Authorization: Bearer <token>
Add Address
http
POST /api/users/addresses
Authorization: Bearer <token>
Request Body:

json
{
  "address1": "123 Main St",
  "address2": "Apt 4B",
  "city": "Accra",
  "state": "Greater Accra",
  "country": "GH",
  "postalCode": "233",
  "isDefault": true
}
Update Address
http
PUT /api/users/addresses/:id
Authorization: Bearer <token>
Delete Address
http
DELETE /api/users/addresses/:id
Authorization: Bearer <token>
🔐 Authentication & Authorization
How It Works
Registration: User creates an account with email and password

Login: User receives a JWT token upon successful authentication

Authorization: The token must be included in the Authorization header for protected routes

Header Format
text
Authorization: Bearer <your_jwt_token>
Token Payload
json
{
  "userId": "clx...",
  "iat": 1704067200,
  "exp": 1704672000
}
Protected Routes
All routes under /api/cart, /api/orders, and /api/users require authentication.

❌ Error Handling
Error Response Format
json
{
  "success": false,
  "message": "Error description here"
}
Common HTTP Status Codes
Code	Meaning
200	Success
201	Created
400	Bad Request
401	Unauthorized
403	Forbidden
404	Not Found
500	Internal Server Error
Custom Error Classes
typescript
// src/middleware/errorHandler.ts
export class AppError extends Error {
  statusCode: number;
  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
  }
}
Example Error Response
json
{
  "success": false,
  "message": "User already exists"
}
🧪 Testing
Running Tests (Coming Soon)
bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage
Manual Testing with curl
bash
# Health check
curl http://localhost:9000/health

# Register a user
curl -X POST http://localhost:9000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123","firstName":"Test","lastName":"User"}'

# Login
curl -X POST http://localhost:9000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Get products (no auth required)
curl http://localhost:9000/api/products

# Get cart (requires auth)
curl -X GET http://localhost:9000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
🚀 Deployment
Deploy to Production
Step 1: Build the Project
bash
npm run build
Step 2: Set Production Environment Variables
env
NODE_ENV=production
PORT=9000
DATABASE_URL=postgres://user:password@host:5432/database
JWT_SECRET=your_production_secret_key
CORS_ORIGIN=https://yourdomain.com
Step 3: Start the Server
bash
npm start
Docker Deployment
dockerfile
# Dockerfile
FROM node:18-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY dist ./dist
COPY prisma ./prisma

EXPOSE 9000
CMD ["node", "dist/index.js"]
Hosting Options
Provider	Price	Best For
Railway	Free tier available	Quick deployment
Render	Free tier available	Easy setup
Heroku	Starts at $5/mo	Production ready
AWS EC2	Pay-as-you-go	Enterprise scale
DigitalOcean	$6/mo droplet	Cost-effective VPS
🔧 Troubleshooting
Common Issues & Solutions
Prisma Connection Error
text
Error: P1000: Authentication failed against database server
Solution:

bash
# Reset PostgreSQL password
docker exec -it biigggstore_postgres psql -U postgres -c "ALTER USER postgres WITH PASSWORD 'postgres';"

# Update DATABASE_URL in .env
DATABASE_URL=postgres://postgres:postgres@localhost:5432/biigggstore
JWT Secret Error
text
Error: Secret must be a string
Solution:

bash
# Generate a new JWT secret
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"

# Add to .env
JWT_SECRET=your_generated_secret_here
Prisma Generate Error
text
Error: Could not find Prisma Schema
Solution:

bash
# Check that prisma/schema.prisma exists
ls prisma/schema.prisma

# Generate client
npx prisma generate
Port Already in Use
text
Error: listen EADDRINUSE: address already in use :::9000
Solution:

bash
# Find and kill the process using port 9000
# Windows:
netstat -ano | findstr :9000
taskkill /PID <PID> /F

# Mac/Linux:
lsof -i :9000
kill -9 <PID>
📚 Additional Resources
Documentation Links
Express.js Documentation

Prisma Documentation

JWT Documentation

PostgreSQL Documentation

API Status Codes
Code	Status	Description
200	OK	Request succeeded
201	Created	Resource created
400	Bad Request	Invalid input
401	Unauthorized	Missing or invalid token
403	Forbidden	Insufficient permissions
404	Not Found	Resource doesn't exist
500	Internal Server Error	Server error
📝 Changelog
v1.0.0 (2026-07-18)
✅ Initial release

✅ Authentication (register, login, JWT)

✅ Product management (CRUD, search, filters)

✅ Shopping cart functionality

✅ Order processing

✅ User profile management

✅ Address management

✅ PostgreSQL with Prisma ORM

✅ TypeScript support

👨‍💻 Contributors
Christian Gyan - Initial development

📄 License
This project is private and proprietary.

Generated by: Senior Developer Documentation System
Last Updated: July 18, 2026
Version: 1.0.0
