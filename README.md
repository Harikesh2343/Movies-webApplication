# 🎬 Movie Booking System

<div align="center">

![Movie Booking Banner](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=1200&h=300&fit=crop)

**A Full-Stack Movie Ticket Booking Application**

[![React](https://img.shields.io/badge/React-18.2-blue?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Latest-brightgreen?logo=mongodb)](https://www.mongodb.com/)
[![Express](https://img.shields.io/badge/Express-4.18-lightgrey?logo=express)](https://expressjs.com/)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Features](#-features) • [Tech Stack](#-tech-stack) • [Installation](#-installation) • [API Documentation](#-api-documentation) • [Screenshots](#-screenshots)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Screenshots](#-screenshots)
- [Common Errors & Solutions](#-common-errors--solutions)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🌟 Overview

The Movie Booking System is a comprehensive full-stack web application that allows users to browse movies, book tickets, and manage their bookings. Admins can add new movies and manage the entire system through a secure authentication system.

### **Key Highlights:**
- 🎫 **User-friendly booking interface**
- 🔐 **Secure JWT authentication** for both users and admins
- 📱 **Responsive design** that works on all devices
- 🎨 **Modern UI** built with Tailwind CSS
- 🔄 **Real-time updates** using React and Redux

---

## ✨ Features

### For Users:
- ✅ **Browse Movies** - View all available movies with details
- ✅ **Book Tickets** - Select seats and book movie tickets
- ✅ **User Authentication** - Secure signup and login
- ✅ **View Bookings** - See all your current and past bookings
- ✅ **Cancel Bookings** - Cancel tickets when needed

### For Admins:
- ✅ **Admin Dashboard** - Manage the entire system
- ✅ **Add Movies** - Add new movies with details
- ✅ **View Analytics** - See all bookings and users
- ✅ **Secure Access** - JWT-based authentication

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|------------|---------|
| ⚛️ **React 18** | UI Framework |
| 🔄 **Redux Toolkit** | State Management |
| 🎨 **Tailwind CSS** | Styling |
| 🔗 **React Router** | Navigation |
| 📡 **Axios** | API Calls |

### Backend
| Technology | Purpose |
|------------|---------|
| 🟢 **Node.js** | Runtime Environment |
| ⚡ **Express.js** | Web Framework |
| 🍃 **MongoDB** | Database |
| 🔒 **bcryptjs** | Password Hashing |
| 🎟️ **JWT** | Authentication |
| 🔄 **Mongoose** | ODM |

---

## 📁 Project Structure

```
movie-booking-system/
│
├── backend/                    # Backend API
│   ├── controllers/            # Request handlers
│   │   ├── admin-controller.js
│   │   ├── booking-controller.js
│   │   ├── movie-controller.js
│   │   └── user-controller.js
│   │
│   ├── models/                 # Database schemas
│   │   ├── Admin.js
│   │   ├── Booking.js
│   │   ├── Movie.js
│   │   └── User.js
│   │
│   ├── routes/                 # API routes
│   │   ├── admin-routes.js
│   │   ├── booking-routes.js
│   │   ├── movie-routes.js
│   │   └── user-routes.js
│   │
│   ├── .env                    # Environment variables
│   ├── app.js                  # Main server file
│   └── package.json
│
├── frontend/                   # React frontend
│   ├── src/
│   │   ├── api-helpers/        # API helper functions
│   │   │   └── api-helpers.js
│   │   │
│   │   ├── components/         # React components
│   │   │   ├── Admin/
│   │   │   ├── Auth/
│   │   │   ├── Bookings/
│   │   │   ├── Movies/
│   │   │   └── Header.jsx
│   │   │
│   │   ├── profile/            # User/Admin profiles
│   │   │   ├── UserProfile.jsx
│   │   │   └── AdminProfile.jsx
│   │   │
│   │   ├── store/              # Redux store
│   │   │   └── index.js
│   │   │
│   │   ├── App.jsx             # Main app component
│   │   └── main.jsx            # Entry point
│   │
│   ├── package.json
│   └── vite.config.js
│
└── README.md                   # This file
```

---

## 🚀 Installation

### Prerequisites
Before you begin, ensure you have the following installed:
- **Node.js** (v18 or higher) - [Download](https://nodejs.org/)
- **MongoDB** account - [Sign up](https://www.mongodb.com/cloud/atlas/register)
- **Git** - [Download](https://git-scm.com/)

### Step 1: Clone the Repository
```bash
git clone https://github.com/yourusername/movie-booking-system.git
cd movie-booking-system
```

### Step 2: Backend Setup

#### 2.1 Navigate to backend folder
```bash
cd backend
```

#### 2.2 Install dependencies
```bash
npm install
```

#### 2.3 Create .env file
Create a `.env` file in the backend folder:
```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your credentials:
```env
MONGODB_PASSWORD=your_mongodb_password
SECRET_KEY=your_secret_key_here
```

> 💡 **Tip:** Replace `your_mongodb_password` with your actual MongoDB Atlas password and create a strong `SECRET_KEY`.

#### 2.4 Start the backend server
```bash
# Development mode (auto-restart on changes)
npm run dev

# OR Production mode
npm start
```

✅ Backend should now be running on `http://localhost:5000`

### Step 3: Frontend Setup

#### 3.1 Open a new terminal and navigate to frontend folder
```bash
cd frontend
```

#### 3.2 Install dependencies
```bash
npm install
```

#### 3.3 Start the frontend development server
```bash
npm run dev
```

✅ Frontend should now be running on `http://localhost:5173`

### Step 4: Access the Application
Open your browser and go to:
```
http://localhost:5173
```

---

## 🔐 Environment Variables

### Backend (.env)

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_PASSWORD` | Your MongoDB Atlas password | `abc123xyz` |
| `SECRET_KEY` | Secret key for JWT tokens | `mySecretKey123!` |

### Frontend
The frontend is pre-configured to connect to `http://localhost:5000` (see `main.jsx`).

---

## 📚 API Documentation

### Base URL
```
http://localhost:5000
```

---

### 👤 User Endpoints

#### 1. User Signup
```http
POST /user/signup
```

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "id": "6501234567890abcdef12345"
}
```

---

#### 2. User Login
```http
POST /user/login
```

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "message": "Login Successful",
  "id": "6501234567890abcdef12345"
}
```

---

#### 3. Get All Users
```http
GET /user/
```

**Response:**
```json
{
  "users": [
    {
      "_id": "650...",
      "name": "John Doe",
      "email": "john@example.com",
      "bookings": []
    }
  ]
}
```

---

#### 4. Get User by ID
```http
GET /user/:id
```

---

#### 5. Update User
```http
PUT /user/:id
```

**Request Body:**
```json
{
  "name": "John Updated",
  "email": "john.new@example.com",
  "password": "newpassword123"
}
```

---

#### 6. Delete User
```http
DELETE /user/:id
```

---

#### 7. Get User's Bookings
```http
GET /user/bookings/:id
```

**Response:**
```json
{
  "bookings": [
    {
      "_id": "650...",
      "movie": "650...",
      "date": "2024-02-20T18:00:00.000Z",
      "seatNumber": 15,
      "user": "650..."
    }
  ]
}
```

---

### 👨‍💼 Admin Endpoints

#### 1. Admin Signup
```http
POST /admin/signup
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "adminpass123"
}
```

---

#### 2. Admin Login
```http
POST /admin/login
```

**Request Body:**
```json
{
  "email": "admin@example.com",
  "password": "adminpass123"
}
```

**Response:**
```json
{
  "message": "Authentication Complete",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "6501234567890abcdef12345"
}
```

---

#### 3. Get All Admins
```http
GET /admin/
```

---

#### 4. Get Admin by ID
```http
GET /admin/:id
```

---

### 🎬 Movie Endpoints

#### 1. Get All Movies
```http
GET /movie/
```

**Response:**
```json
{
  "movies": [
    {
      "_id": "650...",
      "title": "Inception",
      "description": "A mind-bending thriller",
      "releaseDate": "2010-07-16T00:00:00.000Z",
      "posterUrl": "https://...",
      "featured": true,
      "actors": ["Leonardo DiCaprio", "Tom Hardy"],
      "admin": "650...",
      "bookings": []
    }
  ]
}
```

---

#### 2. Get Movie by ID
```http
GET /movie/:id
```

---

#### 3. Add Movie (Admin Only)
```http
POST /movie/
```

**Headers:**
```
Authorization: Bearer <admin_token>
```

**Request Body:**
```json
{
  "title": "Inception",
  "description": "A mind-bending thriller",
  "releaseDate": "2010-07-16",
  "posterUrl": "https://image.url",
  "featured": true,
  "actors": ["Leonardo DiCaprio", "Tom Hardy"]
}
```

---

### 🎫 Booking Endpoints

#### 1. Create Booking
```http
POST /booking/
```

**Request Body:**
```json
{
  "movie": "6501234567890abcdef12345",
  "date": "2024-02-20T18:00:00.000Z",
  "seatNumber": 15,
  "user": "6501234567890abcdef67890"
}
```

---

#### 2. Get Booking by ID
```http
GET /booking/:id
```

---

#### 3. Delete Booking
```http
DELETE /booking/:id
```

**Response:**
```json
{
  "message": "Successfully Deleted"
}
```

---

## 📸 Screenshots

### Home Page
![Home Page](https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&h=500&fit=crop)
*Browse featured movies and latest releases*

### Movie Listing
![Movies](https://images.unsplash.com/photo-1598899134739-24c46f58b8c0?w=800&h=500&fit=crop)
*View all available movies*

### Booking Interface
![Booking](https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=800&h=500&fit=crop)
*Easy-to-use ticket booking interface*

### User Dashboard
![Dashboard](https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?w=800&h=500&fit=crop)
*Manage your bookings*

---

## ⚠️ Common Errors & Solutions

### 1. MongoDB Connection Error
**Error:** `Database connection error`

**Solution:**
- Check if your MongoDB password in `.env` is correct
- Ensure your IP address is whitelisted in MongoDB Atlas
- Verify the connection string format

---

### 2. CORS Error in Frontend
**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Make sure backend is running on port 5000
- Check `app.js` has CORS enabled with correct origin
- Restart both frontend and backend

---

### 3. Token Not Found
**Error:** `Token Not Found`

**Solution:**
- Ensure you're logged in as admin
- Check if token is saved in localStorage
- Try logging in again

---

### 4. Port Already in Use
**Error:** `Port 5000 is already in use`

**Solution:**
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Mac/Linux
lsof -ti:5000 | xargs kill -9
```

---

### 5. Module Not Found
**Error:** `Cannot find module 'xyz'`

**Solution:**
```bash
# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Usage Guide

### For Regular Users:

1. **Sign Up**
   - Click "Auth" in the header
   - Click "Switch to Signup"
   - Fill in your details
   - Click "Signup"

2. **Browse Movies**
   - Click "Movies" in the header
   - View all available movies

3. **Book a Ticket**
   - Click "Book Now" on any movie
   - Select seat number and date
   - Confirm booking

4. **View Your Bookings**
   - Click "Profile" in the header
   - See all your bookings
   - Cancel if needed

### For Admins:

1. **Admin Login**
   - Click "Admin" in the header
   - Enter admin credentials
   - Login

2. **Add a Movie**
   - After login, click "Add Movie"
   - Fill in movie details
   - Submit

3. **View Dashboard**
   - Click "Profile" to see admin dashboard
   - View all movies you've added

---

## 🔄 Development Workflow

### Making Changes:

1. **Backend Changes:**
```bash
cd backend
# Make your changes in controllers/routes/models
# Server auto-restarts if using nodemon
```

2. **Frontend Changes:**
```bash
cd frontend
# Make your changes in components
# Browser auto-refreshes
```

3. **Testing:**
```bash
# Test API endpoints using Postman or Thunder Client
# Test UI manually in browser
```

---

## 🐛 Debugging Tips

1. **Check Backend Logs:**
   - Look at terminal running backend
   - Check for error messages

2. **Check Frontend Console:**
   - Open browser Developer Tools (F12)
   - Look at Console tab for errors

3. **Verify API Calls:**
   - Open Network tab in browser DevTools
   - Check if API calls are being made
   - Verify request/response data

4. **Database Issues:**
   - Use MongoDB Compass to view database
   - Check if data is being saved correctly

---

## 📝 Code Explanations (Beginner Friendly)

### How Authentication Works:

```javascript
// 1. User enters email and password
// 2. Backend checks if user exists
// 3. Backend compares password (hashed)
// 4. If correct, backend creates a JWT token
// 5. Token is sent to frontend
// 6. Frontend stores token in localStorage
// 7. For protected routes, token is sent in headers
```

### How Booking Works:

```javascript
// 1. User selects a movie
// 2. User chooses seat and date
// 3. Frontend sends booking data to backend
// 4. Backend creates booking in database
// 5. Backend updates user's bookings array
// 6. Backend updates movie's bookings array
// 7. Everything happens in a transaction (all or nothing)
```

### How State Management Works (Redux):

```javascript
// 1. User logs in
// 2. dispatch(userActions.login()) is called
// 3. Redux updates isLoggedIn to true
// 4. All components can access this state
// 5. Header shows different options based on login state
```

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
5. Push to the branch (`git push origin feature/AmazingFeature`)
6. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Your Name**
- GitHub: (https://github.com/Harikesh2343)
- Email: harikesh2343@gmail.com

---

## 🙏 Acknowledgments

- [MongoDB](https://www.mongodb.com/) for the database
- [Express.js](https://expressjs.com/) for the backend framework
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [TMDB](https://www.themoviedb.org/) for movie data

---

## 📞 Support

If you have any questions or need help, feel free to:
- Open an issue on GitHub
- Email: harikesh2343@gmail.com


---

<div align="center">

**⭐ Star this repo if you found it helpful!**

Made with ❤️ by developers, for developers

</div>
