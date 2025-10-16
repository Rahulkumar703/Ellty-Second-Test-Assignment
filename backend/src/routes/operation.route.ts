import express from "express";
import { userLimiter } from "../middlewares/rate-limiter.middleware";
import { auth } from "../middlewares/auth.middleware";
import {
  createOperation,
  getOperations,
} from "../controllers/operation.controller";
import { requireDbConnection } from "../middlewares/db.middleware";

const router = express.Router();

// Apply database connection middleware to all operation routes
router.use(requireDbConnection);

// Create operation route
router.post("/new", userLimiter, auth, createOperation);

// Get all operations route
router.get("/:parentType/:parentId", userLimiter, getOperations);

export default router;
