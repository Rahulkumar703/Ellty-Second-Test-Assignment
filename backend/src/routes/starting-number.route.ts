import express from "express";
import { userLimiter } from "../middlewares/rate-limiter.middleware";
import {
  createStartingNumber,
  deleteStartingNumber,
  getAllStartingNumbers,
  getStartingNumberById,
} from "../controllers/starting-number.controller";
import { auth } from "../middlewares/auth.middleware";
import { requireDbConnection } from "../middlewares/db.middleware";

const router = express.Router();

// Apply database connection middleware to all starting number routes
router.use(requireDbConnection);

// Create starting number route
router.post("/new", userLimiter, auth, createStartingNumber);

// Delete starting number route
router.delete("/:id", userLimiter, auth, deleteStartingNumber);

// Get all starting numbers route
router.get("/", userLimiter, getAllStartingNumbers);

// Get starting number by Starting Number ID route
router.get("/:id", userLimiter, getStartingNumberById);

export default router;
