import express from "express";
import {
  registerUser,
  loginUser,
  logoutUser,
  getCurrentUser,
} from "../controllers/user.controller";
import { userLimiter } from "../middlewares/rate-limiter.middleware";
import { auth } from "../middlewares/auth.middleware";
import { requireDbConnection } from "../middlewares/db.middleware";

const router = express.Router();

// Apply database connection middleware to all auth routes
router.use(requireDbConnection);

// User registration route
router.post("/register", userLimiter, registerUser);

// User login route
router.post("/login", userLimiter, loginUser);

// User logout route
router.get("/logout", userLimiter, logoutUser);

// Get current user route
router.get("/me", userLimiter, auth, getCurrentUser);
export default router;
