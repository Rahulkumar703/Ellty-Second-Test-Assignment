import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { apiLimiter } from "./middlewares/rate-limiter.middleware";
import { Request, Response } from "express";
import { authRoutes, operationRoutes, startingNumberRoutes } from "./routes";
import { connectToDatabase, isDbConnected } from "./db";
import dotenv from "dotenv";
dotenv.config();

const app = express();

// Trust proxy for Vercel/production environments
// This allows express-rate-limit to work correctly with X-Forwarded-For headers
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// Middleware
app.use(
  cors({
    credentials: true,
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);

      // In development, allow localhost
      if (process.env.NODE_ENV !== "production") {
        return callback(null, true);
      }

      // In production, allow specific origins
      const allowedOrigins = [
        process.env.CLIENT_URL,
        // Add your frontend Vercel URLs here
      ].filter(Boolean);

      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// parse cookies
app.use(cookieParser());

// public folder
app.use(express.static("public"));

app.use(apiLimiter);

const PORT = process.env.APP_PORT;

// Initialize database connection
connectToDatabase().catch(console.error);

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "Welcome to the API",
    database: isDbConnected() ? "Connected" : "Connecting...",
  });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/starting-number", startingNumberRoutes);
app.use("/api/operation", operationRoutes);

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(
      `Database status: ${isDbConnected() ? "Connected" : "Connecting..."}`
    );
  });
}

export default app;
