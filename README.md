# FreshGo 🥦🛒

FreshGo is a full-featured e-commerce platform for a grocery store, offering fresh produce and household essentials with a seamless shopping experience.

**Live Demo**: [https://fresh-go-zeta.vercel.app/](https://fresh-go-zeta.vercel.app/)

admin route : https://fresh-go-zeta.vercel.app/admin

admin email : super@gmail.com
admin pass : 12345678



## 🛠️ Tech Stack

- **Frontend**: Next.js , React, TypeScript
- **Styling**: Tailwind CSS, shadcn/ui (Radix UI)
- **State Management**: Redux Toolkit with Redux Persist
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (JSON Web Tokens)
- **Email Service**: Nodemailer for order confirmations and OTP verification


## ✨ Features

### 🏪 Product Catalog
- Browse all available products with detailed information
- Filter products by multiple categories (Fruits, Vegetables, Dairy, Bakery, etc.)
- Search functionality with real-time suggestions
- Price range filtering
- Sort by price (high to low, low to high) and newest arrivals

### 👤 User Authentication
- Email-based authentication with OTP verification
- Secure JWT token implementation
- Role-based access control:
  - Customer: Browse products, manage cart, place orders
  - Admin: Manage products, process orders
  - SuperAdmin: Full system access, manage admin users

### 🛒 Shopping Cart
- Add/remove items and update quantities
- Real-time price calculation
- Persistent cart storage between sessions
- Apply discount coupons

### 💳 Checkout Process
- Multiple address management
- Default address selection
- Cash on Delivery payment option
- Order summary with tax and shipping calculation

### 📦 Order Management
- For Customers:
  - Track order status (pending, processing, shipped, delivered)
  - View order history with all details
  - Order confirmation emails

- For Admins:
  - Dashboard to view all orders
  - Update order status
  - View customer details
  - Process shipments

### 🎟️ Coupon System
- Create and manage discount coupons
- Support for percentage and fixed amount discounts
- Minimum purchase requirements
- Coupon validity period
- Single-use and multi-use coupons

### 👨‍💼 Admin Dashboard
- Comprehensive product management (add, edit, delete)
- Inventory tracking
- Customer management
- Order processing
- Coupon management


### 📱 Responsive Design
- Mobile-first approach
- Optimized for various screen sizes
- Touch-friendly interface

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB instance
- Email service credentials

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/fresh-go.git
cd fresh-go
```

2. Install dependencies
```bash
npm install
# or
yarn install
```

3. Environment setup
Create a `.env.local` file with the following variables:
```
MONGO_URI=
JWT_SECRET=

# Host configuration
LOCAL_HOST=
PROD_HOST=

# Email configuration for OTP and notifications
EMAIL_USER=
EMAIL_PASS=

```

4. Run the development server
```bash
npm run dev
# or
yarn dev
```

5. Open [http://localhost:4000](http://localhost:4000) in your browser

## 📁 Project Structure

- `/src/app` - Next.js application routes and pages
- `/src/components` - Reusable UI components
- `/src/lib` - Utility functions, hooks, and Redux store
- `/models` - MongoDB schemas and models
- `/helper` - Helper functions for various tasks

## 🔒 Authentication Flow

1. User enters email address
2. Backend generates OTP and sends to email
3. User verifies with OTP
4. JWT token is issued and stored
5. Protected routes check for valid JWT

## 👥 User Roles

- **Customer**: Standard user who can browse products and place orders
- **Admin**: Can manage products and process orders
- **SuperAdmin**: Has full access to all system functions including admin user management

## 📧 Email Notifications

- Order confirmation emails
- OTP verification for login
- Order shipping notifications
- Password reset emails for admin users



## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

 MIT License 

