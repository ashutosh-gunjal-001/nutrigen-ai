# NutriGen – AI-Powered Nutrition Assistant 🥗🤖

NutriGen is a Gen AI-powered web app that serves as a personal nutrition coach. It provides personalized meal plans, nutrition analysis, and 24/7 AI-based coaching using Google Gemini and USDA APIs.

---

## 🚀 Features

- 🧠 AI-Powered Meal Planning (7-day personalized plans)
- 🥦 Real-time Nutrition Analysis via USDA FoodData
- 💬 Virtual Nutrition Coach using LLMs
- 🔐 Firebase-based User Authentication
- 🎯 Clean & Responsive UI with React + Tailwind

---

## 🛠️ Tech Stack

**Frontend:** React, TailwindCSS, Vite, Redux Toolkit  
**Backend:** Python, Flask, Firebase Admin SDK  
**AI:** Google Gemini via prompt engineering  
**Database:** Firebase Firestore  
**APIs:** USDA FoodData Central, Gemini Pro  

---

## 📷 Screenshots

| Dashboard | Meal Planner | Virtual Coach |
|----------|--------------|----------------|
| ![](docs/screenshots/dashboard.png) | ![](docs/screenshots/mealplanner.png) | ![](docs/screenshots/coach.png) |

---

## 📐 Architecture Diagram

![Architecture](docs/architecture.png)

---

## ⚙️ Installation

### Backend (Flask)
```bash
cd server
pip install -r requirements.txt
python app.py
