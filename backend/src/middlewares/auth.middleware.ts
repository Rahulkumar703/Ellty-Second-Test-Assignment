import { NextFunction, Request, Response } from "express";
import { verifyToken } from "../utils";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  // cookie-parser populates req.cookies
  const token =
    req.cookies?.token ||
    req.headers["authorization"]?.toString().replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  }

  try {
    const verifiedUser = verifyToken(token);
    if (!verifiedUser) {
      return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }

    req.user = verifiedUser;

    next();
  } catch (error) {
    console.error("Token verification error:", error);
    return res
      .status(401)
      .json({ message: "Unauthorized: Token verification failed" });
  }
};
