# Backend API

A Node.js/Express backend API with user authentication using JWT tokens and cookies.

## Features

- User registration and login
- JWT-based authentication with HTTP-only cookies
- Password hashing with bcrypt
- Rate limiting protection
- MongoDB database integration
- TypeScript support

## Tech Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT tokens stored in HTTP-only cookies
- **Security**: bcrypt password hashing, rate limiting, CORS
- **Development**: Nodemon for hot reloading

## API Endpoints

- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- Protected routes use cookie-based JWT authentication

## Setup & Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment variables**
   Create a `.env` file in the backend directory:

   ```env
   APP_PORT=5000
   MONGODB_URI=mongodb://localhost:27017/your-database
   JWT_SECRET=your-jwt-secret-key
   ```

3. **Start development server**

   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   npm start
   ```

## Project Structure

```
src/
├── controllers/     # Request handlers
├── middlewares/     # Auth, rate limiting
├── models/          # MongoDB schemas
├── routes/          # API route definitions
├── types/           # TypeScript type definitions
├── utils/           # JWT utilities
├── index.ts         # Application entry point
└── server.ts        # Express app setup
```

## Development

The server runs on `http://localhost:5000` by default. API endpoints are prefixed with `/api`.

Authentication uses HTTP-only cookies for security. The auth middleware reads tokens from `req.cookies.token` and verifies them using JWT.
