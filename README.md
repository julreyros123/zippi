# Zippi - Cross-Platform Group Chat App

Welcome to Zippi, the ideal full-stack cross-platform group chat application.

## 🏗️ Architecture Stack

- **Frontend**: React + Vite + Tailwind + Zustand
- **Mobile**: React Native + Expo
- **Backend**: Node.js + Express + JWT (for authentication)
- **Realtime**: Socket.io + Redis
- **Data**: PostgreSQL + Prisma

## 📂 Project Structure

- `web/backend`: The Node.js Express server handling core operations, socket connections, and database mapping using Prisma.
- `web/frontend`: The React Vite application using Tailwind CSS for UI and Zustand for state.
- `/mobile`: The React Native app running via Expo.

## 🚀 Getting Started

**Backend setup:**
1. Navigate to `web/backend`
2. Run `npm install`
3. Set your PostgreSQL database URI in `.env` as `DATABASE_URL`
4. Run `npx prisma db push` to push the initial DB schema.
5. Run `npm run dev` to start the backend server.

**Frontend setup:**
1. Navigate to `web/frontend`
2. Run `npm install` (if not done)
3. Run `npm run dev` 

**Mobile setup:**
1. Navigate to `/mobile`
2. Run `npm install` 
3. Run `npx expo start`

