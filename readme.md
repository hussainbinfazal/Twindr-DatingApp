# 💖 Twinder: Real-Time Chat & Dating App

A modern full-stack dating and chat platform built with the MERN stack, featuring real-time messaging, profile management, and swipe-based matchmaking.

---

## 🌟 Project Overview

Twinder is a comprehensive dating and chat application that enables users to create profiles, swipe to match, and communicate in real time. The platform offers a seamless user experience with robust authentication, profile picture uploads, and instant notifications.

---

## ✨ Key Features

### 🎯 Core Dating Functionality
- **Profile Management:** Create, update, and delete user profiles with photo uploads.
- **Swipe Matching:** Tinder-style left/right swipe to like or pass on profiles.
- **Match System:** Mutual likes result in a match and unlock chat functionality.
- **Unmatch/Dislike:** Remove matches or dislike users to refine recommendations.

### 💬 Real-Time Chat
- **Instant Messaging:** Real-time 1:1 chat using Socket.IO.
- **Message Status:** Sent, delivered, and seen indicators.
- **Audio Messages:** Record and send voice messages.
- **Emoji Support:** Integrated emoji picker for expressive chats.
- **Online Status:** See when matches are online.

### 🔐 Security & Authentication
- **JWT Authentication:** Secure login and protected API routes.
- **Role-Based Access:** Separate flows for authenticated and unauthenticated users.
- **Secure Cookies:** HttpOnly and SameSite cookie policies.

### ⭐ User Experience
- **Responsive Design:** Optimized for mobile and desktop.
- **Profile Picture Upload:** Easy drag-and-drop or file selection.
- **Toast Notifications:** Real-time feedback for actions.
- **Intuitive UI:** Clean, modern interface with Tailwind CSS.

---

## 🛠️ Technology Stack

### Frontend
- **React** (with Vite) – Component-based UI
- **Tailwind CSS** – Utility-first styling
- **Socket.IO Client** – Real-time communication
- **Zustand** – State management
- **React Router** – Routing

### Backend
- **Node.js & Express** – REST API
- **MongoDB & Mongoose** – Database & ODM
- **Socket.IO** – Real-time server
- **Multer** – File uploads (profile pictures, audio)
- **JWT** – Authentication

---

## 🏗️ Architecture Highlights

- **Real-Time Messaging:**  
  Client ↔ Socket.IO Server ↔ MongoDB

- **Authentication Flow:**  
  User Login → JWT Issued → Protected Routes

- **Profile & Matchmaking:**  
  User CRUD → Swipe → Match → Chat Unlock

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- npm or yarn
- MongoDB instance

### Installation

Clone the repository:
```sh
git clone https://github.com/hussainbinfazal/Twindr-DatingApp
cd twinder-chat-dating-app

cd frontend
npm run dev

cd backend
npm run dev

```

---

🙏 Thank You! Thank you for taking the time to explore this project! Your interest in my work means a lot. I hope this dating platform demonstrates my passion for creating innovative solutions and my commitment to clean, scalable code.

⭐ If you found this project interesting, please consider giving it a star!

Built with ❤️ using React, Socket.IO, and modern web technologies