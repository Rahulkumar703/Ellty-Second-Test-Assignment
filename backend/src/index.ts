import dotenv from "dotenv";
dotenv.config();

import app from "./server";
import mongoose from "mongoose";
import { Request, Response } from "express";
import { authRoutes, operationRoutes, startingNumberRoutes } from "./routes";

const PORT = process.env.APP_PORT;
const MONGODB_URI = process.env.MONGODB_URI;

// Health check route
app.get("/", (req: Request, res: Response) => {
  res.json({ message: "Welcome to the API" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/starting-number", startingNumberRoutes);
app.use("/api/operation", operationRoutes);

// Start the server
app.listen(PORT, () => {
  const dbConnect = async () => {
    try {
      await mongoose.connect(MONGODB_URI!);
      console.log("Database connected successfully");
    } catch (error) {
      console.error("Database connection failed:", error);
    }
  };

  dbConnect();

  console.log(`Server is running on port http://localhost:${PORT}`);
});
