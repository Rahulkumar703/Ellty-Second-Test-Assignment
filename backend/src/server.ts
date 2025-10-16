import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/rate-limiter.middleware";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { authRoutes, operationRoutes, startingNumberRoutes } from "./routes";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Middleware
app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// public folder
app.use(express.static("public"));

app.use(apiLimiter);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/starting-number", startingNumberRoutes);
app.use("/api/operation", operationRoutes);

const PORT = process.env.APP_PORT;
const MONGODB_URI = process.env.MONGODB_URI;

// Optimize mongoose for serverless (Vercel)
mongoose.set("bufferCommands", false);

// Connect to MongoDB with serverless-optimized options
if (MONGODB_URI) {
  mongoose
    .connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s instead of 30s
      socketTimeoutMS: 45000, // Close sockets after 45s of inactivity
      bufferCommands: false, // Disable mongoose buffering
      maxPoolSize: 10, // Maintain up to 10 socket connections
      minPoolSize: 5, // Maintain minimum 5 socket connections
    })
    .then(() => console.log("Database connected"))
    .catch((err) => console.error("Database error:", err));
}

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(
      `Database status: ${
        mongoose.connection.readyState === 1 ? "Connected" : "Connecting..."
      }`
    );
  });
}

export default app;
