# FitHub — Full-Stack Personal Health & Fitness Platform

FitHub is a full-stack health, nutrition, and fitness tracking web application built with **React**, **Tailwind CSS**, and **Django REST Framework**. It centralizes workout logging, calorie and macro tracking, daily hydration goals, and body weight progression into a unified dashboard.

---

## Key Features

- **Authentication & Guided Onboarding:** JWT-based user registration and login (`SimpleJWT`) paired with a 3-step onboarding wizard that captures age, sex, weight, height, and fitness goals.
- **Dashboard Overview:** Real-time summary cards displaying calories consumed, active workout minutes, water intake, latest weight, and quick-action logging shortcuts.
- **Workout & Training Tracker:** Categorized exercise logging (Strength, Cardio, HIIT, Flexibility/Yoga) with automatic duration and calorie burn totals.
- **Nutrition & Calorie Tracker:** Meal logging with full macronutrient tracking (Protein, Carbs, and Fats in grams) and daily intake summaries.
- **Hydration Tracker:** Interactive daily water intake progress bar (`3.0 L` goal), quick-add presets (`+250 ml`, `+500 ml`, `+750 ml`), and custom volume logging.
- **Body Progress Tracker:** Weight check-in history with milestone notes, total weight change calculations, and entry management.
- **Editable User Profile:** Custom avatar upload/removal, display username customization, personal metrics editing, and activity statistics.
- **Resilient Dual-Persistence:** Seamless synchronization between Django REST APIs and browser `localStorage` fallback for uninterrupted offline usability.

---

## Tech Stack

- **Frontend:** React, Vite, React Router, Tailwind CSS
- **Backend:** Python, Django, Django REST Framework, SimpleJWT
- **Database:** SQLite (Development) / PostgreSQL ready

---

## Project Structure

```text
fitness/
├── backend/          # Django & Django REST Framework API
├── frontend/         # React + Vite + Tailwind CSS client
├── .gitignore        # Ignored build, environment, and cache files
└── README.md         # Project documentation