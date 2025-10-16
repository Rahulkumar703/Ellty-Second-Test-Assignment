import express from "express";
import { userLimiter } from "../middlewares/rate-limiter.middleware";
import {
  createStartingNumber,
  deleteStartingNumber,
  getAllStartingNumbers,
  getStartingNumberById,
} from "../controllers/starting-number.controller";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

// Create starting number route
router.post("/new", userLimiter, auth, createStartingNumber);

// Delete starting number route
router.delete("/:id", userLimiter, auth, deleteStartingNumber);

// Get all starting numbers route
router.get("/", userLimiter, getAllStartingNumbers);

// Get starting number by Starting Number ID route
router.get("/:id", userLimiter, getStartingNumberById);

export default router;
