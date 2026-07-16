# TypeSprint

TypeSprint is a production-ready, highly interactive typing platform built with modern web technologies. It features real-time multiplayer racing, AI-generated typing paragraphs across various topics, global leaderboards, and an engaging achievement system.

## 🚀 Features

* **Real-time Multiplayer:** Race against friends or strangers in real-time using WebSockets.
* **AI-Generated Text:** Practice your typing with dynamically generated paragraphs across categories like Programming, Science, History, and more.
* **Global Leaderboard:** Compete for the top spot on the global WPM leaderboard.
* **Achievement System:** Unlock badges as you hit typing milestones (e.g., Speed Demon for 100+ WPM).
* **Detailed Analytics:** Track your WPM, accuracy, and personal bests over time with beautiful interactive charts.
* **OAuth Integration:** Seamlessly log in or register using your Google account.
* **Modern UI:** Built with React 19, Tailwind CSS, and Framer Motion for a stunning, responsive, and glassmorphic design.

## 🛠️ Tech Stack

### Frontend
* React 19
* Vite
* Tailwind CSS
* Framer Motion (Animations)
* Recharts (Data Visualization)
* Redux Toolkit (State Management)
* Socket.IO Client
* React Hook Form & Zod (Validation)

### Backend
* NestJS
* TypeORM (PostgreSQL)
* Socket.IO (WebSockets)
* Passport.js (JWT & Google OAuth)
* Swagger (API Documentation)

## 🏗️ Setup & Installation

### 1. Database Configuration
Ensure you have PostgreSQL installed and running. Create a database named `typesprint`.
Update the `.env` file in the `backend/` directory with your database credentials:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=typesprint
```

### 2. Backend Setup
Navigate to the `backend/` directory and install dependencies:
```bash
cd backend
npm install
```

Set up your OAuth and JWT credentials in the `.env` file:
```env
JWT_SECRET=your_super_secret_jwt_key
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback
```

Run database migrations to initialize the schema:
```bash
npm run typeorm -- migration:run -d src/typeorm.config.ts
```

Start the backend server:
```bash
npm run start:dev
```

### 3. Frontend Setup
Navigate to the `frontend/` directory and install dependencies:
```bash
cd frontend
npm install
```

Start the frontend development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`.

## 📜 Scripts

**Backend:**
* `npm run start:dev`: Starts the NestJS server in watch mode.
* `npm run build`: Compiles the TypeScript application into the `dist/` directory.
* `npm run migration:generate`: Generates TypeORM migrations based on entity changes.
* `npm run migration:run`: Executes pending migrations.

**Frontend:**
* `npm run dev`: Starts the Vite development server.
* `npm run build`: Builds the production bundle.

## 🔒 Production Readiness

This application is configured for production environments:
* **Database Synchronization:** Disabled in favor of explicit TypeORM migrations to prevent accidental schema drops.
* **Authentication:** Secured with JWT and robust guard implementation.
* **Environment Variables:** Essential configurations are extracted to `.env`.

---
*Built as a state-of-the-art demonstration of advanced full-stack development.*
