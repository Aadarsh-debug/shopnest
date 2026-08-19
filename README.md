# 🛍️ ShopNest

**ShopNest** is a full-stack e-commerce web application built using the **MERN stack**. It provides a complete online shopping experience with product browsing, user authentication, cart and order management, secure payments, image management, and backend APIs.

The project follows a separate frontend/backend architecture, making it easier to maintain and scale the application.

## 🚀 Features

### 👤 User Features

* User registration and login
* JWT-based authentication
* Secure password hashing with bcrypt
* Browse products
* Product details
* Search and product filtering
* Add products to cart
* Update cart quantities
* Remove products from cart
* Place orders
* Secure online payments using Razorpay
* Order management

### 🛒 E-Commerce Features

* Product catalog
* Product categories
* Product images
* Shopping cart
* Order processing
* Payment integration
* Inventory/product management

### 🔐 Authentication & Security

* JWT authentication
* Password hashing with bcrypt
* Protected backend routes
* Environment variable based configuration
* CORS configuration

### ☁️ Media & Communication

* Cloudinary integration for image uploads
* Multer for handling multipart/form-data
* Nodemailer for email functionality

## 🧑‍💻 Tech Stack

### Frontend

* React
* JavaScript
* HTML5
* CSS3

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose

### Authentication & Security

* JSON Web Tokens (JWT)
* bcrypt
* CORS

### Other Technologies

* Razorpay
* Cloudinary
* Multer
* Nodemailer
* dotenv
* Nodemon

## 🏗️ Project Architecture

```text
ShopNest/
│
├── frontend/                 # React frontend
│
├── backend/
│   ├── config/               # Database and application configuration
│   ├── controllers/          # Business logic
│   ├── middlewares/          # Authentication and request middleware
│   ├── models/               # MongoDB/Mongoose models
│   ├── routes/               # REST API routes
│   ├── utils/                # Utility functions
│   ├── index.js              # Backend entry point
│   └── seed.js               # Database seed script
│
├── package.json              # Root project scripts
└── README.md
```

## 🔄 Application Flow

```text
                    ┌─────────────────┐
                    │     Frontend    │
                    │     React       │
                    └────────┬────────┘
                             │
                             │ HTTP Requests
                             ▼
                    ┌─────────────────┐
                    │     Express     │
                    │      REST API   │
                    └────────┬────────┘
                             │
              ┌──────────────┼──────────────┐
              │              │              │
              ▼              ▼              ▼
        ┌──────────┐   ┌───────────┐   ┌───────────┐
        │ MongoDB  │   │ Cloudinary│   │ Razorpay  │
        │ Database │   │   Images  │   │  Payments │
        └──────────┘   └───────────┘   └───────────┘
```

## ⚙️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/Aadarsh-debug/shopnest.git
cd shopnest
```

### 2. Install dependencies

The project provides a root-level installation script:

```bash
npm run install-all
```

This installs dependencies for the root project, backend, and frontend.

### 3. Configure environment variables

Create a `.env` file inside the `backend` directory.

Example:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

> Never commit your `.env` file or expose API keys and secrets publicly.

## ▶️ Running the Project

### Run frontend and backend together

From the root directory:

```bash
npm run dev
```

### Run backend separately

```bash
cd backend
npm run dev
```

### Run frontend separately

```bash
cd frontend
npm start
```

## 🌱 Database Seeding

The project includes a database seed script.

From the root directory:

```bash
npm run seed
```

## 📦 Production Build

To build the frontend:

```bash
npm run build
```

## 🔑 Environment Variables

| Variable                | Purpose                   |
| ----------------------- | ------------------------- |
| `PORT`                  | Backend server port       |
| `MONGO_URI`             | MongoDB connection string |
| `JWT_SECRET`            | JWT signing secret        |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name     |
| `CLOUDINARY_API_KEY`    | Cloudinary API key        |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret     |
| `RAZORPAY_KEY_ID`       | Razorpay public key       |
| `RAZORPAY_KEY_SECRET`   | Razorpay secret           |
| `EMAIL_USER`            | Email account             |
| `EMAIL_PASSWORD`        | Email authentication      |

## 🧠 What I Learned

Building ShopNest helped me gain practical experience with:

* MERN stack application architecture
* REST API development
* MongoDB database design
* Mongoose models and relationships
* JWT authentication
* Password hashing and authentication security
* Middleware-based authorization
* Image uploads with Cloudinary
* Payment gateway integration with Razorpay
* Email integration using Nodemailer
* Handling multipart file uploads with Multer
* Frontend-backend API communication
* Environment-based configuration
* Structuring a scalable full-stack application

## 🔮 Future Improvements

* Add product reviews and ratings
* Add wishlist functionality
* Add advanced product filtering
* Add admin analytics dashboard
* Add order tracking
* Add inventory alerts
* Improve caching and API performance
* Add automated testing
* Deploy frontend and backend with CI/CD

## 👨‍💻 Author

**Aadarsh Mishra**

* GitHub: [Aadarsh-debug](https://github.com/Aadarsh-debug)

## ⭐ Support

If you found this project useful, consider giving the repository a ⭐ on GitHub.
