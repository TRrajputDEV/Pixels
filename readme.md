watch demo : https://drive.google.com/file/d/1LfoMOE7obG6GxCdbURKzo8NqHlRZTr9A/view?usp=sharing

check linkedin: www.linkedin.com/in/tushartanwar183

# 🎥 Pixels - A Full-Stack Video Streaming Platform

> **This application began development on _June 30, 2025_**.  
> Aiming to become a production-grade video streaming platform built from scratch by a solo developer.

---

## 🚀 Project Overview

**Pixels** is a full-stack video streaming application inspired by YouTube, built with the **MERN stack** (MongoDB, Express.js, React, Node.js). It includes video upload, playback, engagement systems, user profiles, authentication, content discovery, and more.

The goal is to simulate a real-world, scalable media platform with a professional UI, deep feature set, and long-term vision.

---

## ✅ Current Features (Phase 1 Complete)

### 🎬 Core Video System
- Video Upload (with Cloudinary)
- Custom Video Player (play/pause, seek, volume, fullscreen)
- Thumbnail Upload & Display
- Video Metadata (title, description, duration, view count)
- Full CRUD for Videos

### 👤 User Authentication & Profiles
- JWT-based Auth (Login/Register)
- Protected Routes with Access Control
- User Profiles with Avatar, Cover Image, and Details
- Global Auth Context (React)

### 💬 Engagement Features
- Comment System (Add/Edit/Delete)
- Like/Dislike on Videos & Comments (with real-time counts)
- Collapsible Comments & Lazy Loading
- Auth Prompts for Anonymous Actions

### 🔍 Content Discovery
- Homepage with Real Backend Video Grid
- Full-text Search with Filters (title, date, views)
- Advanced Filtering System
- Clean Video Card UI

### 💎 UI/UX Excellence
- Fully Responsive Layout (Mobile Friendly)
- Dark/Light Mode Toggle with Persistence
- Skeleton Loaders & Loading States
- Toast Notifications & Error Handling
- Professional UI built with **Tailwind CSS** + **Shadcn**

### 🧱 Technical Stack
- **Frontend**: React 18, Vite, React Router v6
- **Backend**: Node.js, Express.js, MongoDB
- **Storage**: Multer + Cloudinary
- **Auth**: JWT with Secure Tokens
- **API**: RESTful with Clean Separation of Concerns
- **Dev Practices**: Git Feature Branches, Code Reviews, 60+ Commits, Modular Codebase

---

## 📊 Feature Completion Status

- **Lines of Code**: ~2,000+
- **Commits**: 60+
- **Completion**: ~25%
- **Current Phase**: Core Systems + User Interaction

---

## 🛠️ Upcoming Roadmap

### 🗓️ Month 2–3
- User Dashboard (Analytics, Upload History)
- Creator Channels (Branding, Layouts, Subscriptions)
- Playlist System (Create, Edit, Share, Watch Later)
- Watch History & Recommendations

### 🗓️ Month 3–4
- Live Streaming (WebRTC/RTMP + Live Chat)
- Stream Recording & Notification System
- Advanced Analytics Dashboard
- Video Processing (Compression, Multi-Quality)

### 🗓️ Month 4–5
- CDN Integration, Redis Caching, Load Balancing
- Dockerized Microservices Setup
- Real-Time Features (WebSocket, Messaging, Push Notifications)

### 🧠 Future Vision
- AI-Powered Recommendations
- Auto-thumbnail Generation & Tags
- Native Mobile App with Offline Viewing
- Monetization Systems (Ads, Memberships, Super Chat)

---

## 🧠 Personal Mission

This project isn't just a technical showcase—it's a journey.

> _“If I master this project, I’ll learn more than 10 simple projects combined.”_  

Pixels is a one-man mission to deeply understand **full-stack architecture**, improve real-world dev skills, and create something truly **standout** in a sea of boilerplate clones.

---

## 📸 Screenshots
<img width="1902" height="1079" alt="Screenshot 2025-08-07 010343" src="https://github.com/user-attachments/assets/30f0c264-e767-4574-94d4-63a5c144f68d" />
<img width="404" height="875" alt="Screenshot 2025-08-07 010319" src="https://github.com/user-attachments/assets/69bcffa7-8c4c-44f1-ab80-0dc10aff6a9e" />
<img width="1896" height="1078" alt="Screenshot 2025-08-07 010234" src="https://github.com/user-attachments/assets/0e52e93d-ec60-4f3c-95f7-f6e280549352" />
<img width="1918" height="1079" alt="Screenshot 2025-08-07 010201" src="https://github.com/user-attachments/assets/16cbdae3-948d-41a3-b8b2-5b2a392facef" />
<img width="1898" height="1076" alt="Screenshot 2025-08-07 010147" src="https://github.com/user-attachments/assets/96639395-7279-4aaa-a6fb-06597a9fd7fd" />
<img width="1905" height="1075" alt="Screenshot 2025-08-07 010119" src="https://github.com/user-attachments/assets/a9d5967c-bac8-48b7-98ec-fce5d69caa89" />

---

## 📦 Installation (Coming Soon)

```bash
# Clone the repo

git clone https://github.com/yourusername/pixels-video-platform.git
cd pixels-video-platform

# Install dependencies for frontend and backend
cd client && npm install
cd ../server && npm install

# Setup environment variables (.env files)

# Start both servers
npm run dev
