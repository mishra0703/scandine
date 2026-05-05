<div align="center">

# 🍽️ Scandine

### QR-based Digital Ordering System for Restaurants

*Customers scan. Customers order. No queues. No hassle.*

[![Live Demo](https://img.shields.io/badge/Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://scandinee.vercel.app/)
[![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Razorpay](https://img.shields.io/badge/Razorpay-02042B?style=for-the-badge&logo=razorpay&logoColor=3395FF)](https://razorpay.com)

</div>

---

## 📌 What is Scandine?

**Scandine** is a full-stack web application that digitizes the restaurant ordering experience. Each table gets a unique QR code — customers scan it, browse the menu, place their order, and pay online — all without downloading an app or waiting for a waiter.

The restaurant admin gets a dashboard to manage the menu and track incoming orders in real time.

---

## ✨ Features

**For Customers**
- Scan the restaurant QR code to open the menu instantly in any browser — no app download needed
- Browse menu items with descriptions and starred favourites highlighted
- Place orders and complete payment via Razorpay — right from the table

**For Restaurant Admin**
- Secure login with bcrypt-hashed credentials
- Add, edit, and delete menu items
- Star and highlight favourite / recommended items on the menu
- Manage inventory — track stock and item availability
- Monitor restaurant stats and order analytics
- Manage live orders in real time as they come in

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | Next.js API Routes |
| Database | MongoDB, Mongoose |
| Payments | Razorpay |
| Auth | bcrypt (admin password hashing) |
| Deployment | Vercel + MongoDB Atlas |

---


## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or above)
- [npm](https://www.npmjs.com/)
- A [MongoDB Atlas](https://www.mongodb.com/atlas) cluster
- A [Razorpay](https://razorpay.com/) account (for payment keys)

### Installation

**1. Clone the repository**
```bash
git clone https://github.com/mishra0703/scandine.git
cd scandine
```

**2. Install dependencies**
```bash
npm install
```

**3. Set up environment variables**

Create a `.env.local` file in the root directory and add the following:

```
envCLOUDINARY_CLOUD_NAME = xyz
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME = xyz
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET = xyz
CLOUDINARY_API_KEY = xyz
CLOUDINARY_API_SECRET = xyz
MONGODB_URI = mongodb://localhost:27017/Scandine
NEXTAUTH_SECRET = xyz
NEXTAUTH_URL = http://localhost:3000
NEXT_PUBLIC_URL = xyz
ADMIN_EMAIL = xyz
ADMIN_PASSWORD = xyz
RAZORPAY_KEY_ID = xyz
RAZORPAY_KEY_SECRET = xyz
NEXT_PUBLIC_RAZORPAY_KEY_ID = xyz
```

> ⚠️ Never commit your `.env.local` file. It's already in `.gitignore`.

**4. Run the development server**
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📁 Project Structure

```
scandine/
├── app/
│   ├── admin/
│   │   └── login/
│   │       └── page.js               # Admin login page
│   ├── api/
│   │   ├── admin/
│   │   │   ├── me/                   # Get logged-in admin info
│   │   │   └── update/               # Update admin profile
│   │   ├── auth/
│   │   │   └── [...nextauth]/        # NextAuth dynamic route
│   │   ├── categories/               # Menu category endpoints
│   │   ├── cloudinary/               # Image upload handling
│   │   ├── create-order/             # Razorpay order creation
│   │   ├── items/                    # Menu item CRUD endpoints
│   │   ├── orders/
│   │   │   ├── my/                   # Customer order history
│   │   │   └── route.js              # All orders endpoint
│   │   ├── settings/                 # Restaurant settings
│   │   └── verify-order/             # Razorpay payment verification
│   ├── dashboard/                    # Admin dashboard
│   ├── db/                           # DB connection setup
│   ├── inventory/                    # Inventory management page
│   ├── item/                         # Individual item page
│   ├── live-orders/                  # Real-time orders view
│   ├── menu/                         # Customer-facing menu
│   ├── models/                       # Mongoose schemas
│   ├── my-orders/                    # Customer order tracking
│   ├── order/                        # Order summary page
│   ├── profile/                      # Admin profile page
│   ├── favicon.ico
│   ├── globals.css
│   ├── layout.js                     # Root layout
│   └── page.js                       # Home / landing page
├── components/                       # Reusable React components
├── context/                          # React context providers
├── lib/                              # Utilities and helpers
├── public/                           # Static assets
├── .gitignore
├── README.md
├── package.json
└── package-lock.json
```

---

## 🔑 How QR Codes Work

The restaurant has a single QR code displayed on each table. When a customer scans it, they land directly on the digital menu in their browser — no app install, no account creation required.

Orders placed through the menu are instantly visible on the admin dashboard, tagged with timestamps so the kitchen and staff can manage them in real time.

---

## 🌐 Live Demo

👉 [View Live](https://scandinee.vercel.app/)

---

## 🙋‍♂️ Author

**Prem Mishra**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0A66C2?style=flat&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/prem-mishra-6b42122a6/)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat&logo=github&logoColor=white)](https://github.com/mishra0703)

---

## 📄 License

This project is open source and available under the [MIT License](./LICENSE).
