# Show-Case Architects

[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen)](https://github.com/yemom/show-case-architects)

## 🚀 Project Overview

**Show-Case Architects** is a web application for architects and designers to showcase their projects and portfolios.  
It provides a **modern, responsive UI** with dynamic content rendering and smooth interactions.

---

## 🖥️ Live Demo
> Add your deployed app link here
[Live Demo](http://your-live-demo-url.com)

---

## 💻 Features

- Responsive frontend built with **Tailwind CSS & TypeScript**
- Dynamic project listings via **Node.js & Express backend**
- Media handling (images/videos) with proper routing
- Easy content management via REST APIs
- Fully LAN-accessible for local testing

---

## 📁 Project Structure

my-showcase-architects/
├─ my-showcase/ # Frontend
│ ├─ src/
│ ├─ public/
│ └─ package.json
├─ server/ # Backend (Node.js/Express)
│ ├─ route/
│ ├─ configs/
│ └─ server.js
├─ .env
├─ package.json
└─ README.md


---

## ⚙️ Tech Stack

- **Frontend:** TypeScript, React, Tailwind CSS, Vite
- **Backend:** Node.js, Express, MongoDB
- **Dev Tools:** Vitest (unit testing), Playwright (E2E testing), dotenv, CORS

---

## 🧩 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yemom/show-case-architects.git
cd show-case-architects


npm install
cd my-showcase
npm install

PORT=3000
MONGO_URI=your_mongodb_uri
NODE_ENV=development

cd server
npm start

cd my-showcase
npm run dev


🧪 Testing

Unit/Integration: Vitest (npx vitest run)

End-to-End: Playwright (npx playwright test)

Test both frontend and backend APIs

📐 Project Architecture

See diagram below for frontend/backend separation and data flow.

📝 Contribution

Fork the repo

Create a branch for your feature

Submit a Pull Request

Follow coding conventions and add tests

⚖️ License

MIT License

---

# **2️⃣ Project Architecture Diagram**

Here’s a **textual ASCII-style draft**, which you can turn into an actual diagram in tools like **Draw.io, Figma, or Lucidchart**:

+-------------------------+
| Frontend |
| (my-showcase React App) |
+-------------------------+
|
| REST API / HTTP
v
+-------------------------+
| Backend |
| (Express + Node.js) |
| - Routes |
| - Controllers |
| - MongoDB Models |
+-------------------------+
|
| Mongoose
v
+-------------------------+
| Database |
| MongoDB |
+-------------------------+


**Flow Explanation:**
1. **User / Client** interacts with **Frontend** (React/Tailwind).  
2. Frontend calls **Backend APIs** (`/api/admin`, `/api/blog`) for data.  
3. **Backend** interacts with **MongoDB** for CRUD operations.  
4. Media (images/videos) are served from `/uploads` folder.  

---

