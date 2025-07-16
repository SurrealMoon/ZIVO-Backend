# ZIVO-Backend

This repository contains the backend server for the **ZIVO** mobile application. It is built using **Node.js**, **Express.js**, and **TypeScript**, and follows a modular and scalable architecture. The backend provides user authentication, profile operations, file upload capabilities, and role-based access control.

## 🚀 Features

- User registration and login (authentication)
- Profile management endpoints
- File upload via presigned URLs (e.g., Supabase Storage)
- Role-based authorization (middleware-based)
- Type-safe API with TypeScript
- Prisma ORM for PostgreSQL database interaction

## 🛠️ Tech Stack

- **Node.js** + **Express**
- **TypeScript**
- **Prisma ORM**
- **PostgreSQL** (via Supabase)
- **dotenv** for environment configuration
- **ts-node-dev** for development

## 📁 Project Structure

```
src/
├── config/         # Configuration and environment setup
├── controllers/    # Request handlers for each route
├── database/       # DB connection and Prisma client
├── lib/            # Utility modules (e.g., tokens, validation)
├── middlewares/    # Authentication, authorization, logging
├── routes/         # Express route definitions
├── scripts/        # CLI or automation scripts
├── services/       # Business logic and service layer
├── types/          # Custom TypeScript types and interfaces
├── utils/          # Helper functions
└── main.ts         # Application entry point
```

## ⚙️ Getting Started

1. Install dependencies:
```bash
npm install
```

2. Setup the database:
```bash
npx prisma generate
npx prisma migrate dev
```

3. Run the development server:
```bash
npm run dev
```

## 📄 License

This project is **not open source**. All rights reserved © 2025 Mehmet Yıldırım. See [LICENSE.txt](./LICENSE.txt) for more information.
