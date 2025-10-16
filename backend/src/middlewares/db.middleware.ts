import { Request, Response, NextFunction } from "express";
import { ensureDbConnection } from "../db";

/**
 * Middleware to ensure database connection before processing requests
 * Use this for any routes that need database access
 */
export const requireDbConnection = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await ensureDbConnection();
    next();
  } catch (error) {
    console.error("Database connection failed:", error);
    res.status(503).json({
      success: false,
      message: "Database connection failed. Please try again later.",
      type: "error",
    });
  }
};

export default requireDbConnection;
