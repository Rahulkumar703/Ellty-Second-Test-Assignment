import express from "express";
import { userLimiter } from "../middlewares/rate-limiter.middleware";
import { auth } from "../middlewares/auth.middleware";
import {
  createOperation,
  getOperations,
} from "../controllers/operation.controller";

const router = express.Router();

// Create operation route
router.post("/new", userLimiter, auth, createOperation);

// Get all operations route
router.get("/:parentType/:parentId", userLimiter, getOperations);

export default router;
