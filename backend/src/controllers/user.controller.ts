import { Request, Response } from "express";
import User from "../models/user.model";
import { generateToken } from "../utils";

const registerUser = async (req: Request, res: Response) => {
  try {
    // Body validation
    if (!req.body || !req.body.password || !req.body.username) {
      return res
        .status(400)
        .json({ message: "Username and password are required" });
    }

    const { username, password } = req.body;

    // Clean and validate username (no spaces, lowercase)
    const cleanedUsername = username.trim().toLowerCase().replace(/ /g, "_");

    if (cleanedUsername.length < 3 || cleanedUsername.length > 30) {
      return res
        .status(400)
        .json({ message: "Username must be between 3 and 30 characters" });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ username: cleanedUsername });

    if (existingUser) {
      return res.status(409).json({ message: "Username is already taken" });
    }

    // Create new user
    const newUser = await User.create({ username, password });

    if (!newUser) {
      return res.status(500).json({ message: "Failed to create user" });
    }

    // Generate JWT token
    const token = await generateToken({
      _id: String(newUser._id),
      username: newUser.username,
    });

    // Set token in HTTP-only cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "User registered successfully",
      type: "success",
      success: true,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({
      message: "Internal server error",
      type: "error",
      success: false,
    });
  }
};

const loginUser = async (req: Request, res: Response) => {
  // Body validation
  if (!req.body || !req.body.password || !req.body.username) {
    return res.status(400).json({
      message: "Username and password are required",
      type: "error",
      success: false,
    });
  }

  const { username, password } = req.body;

  // Clean and validate username (no spaces, lowercase)
  const cleanedUsername = username.trim().toLowerCase().replace(/ /g, "_");

  if (cleanedUsername.length < 3 || cleanedUsername.length > 30) {
    return res.status(400).json({ message: "Invalid username or password" });
  }

  // Check if user exists
  const user = await User.findOne({ username: cleanedUsername }).select(
    "+password"
  );

  // Match password
  if (!user || !user.comparePassword(password)) {
    return res.status(401).json({ message: "Invalid username or password" });
  }

  // Generate JWT token
  const token = await generateToken({
    _id: String(user._id),
    username: user.username,
  });

  // Set token in HTTP-only cookie
  res.cookie("token", token, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 12 * 60 * 60 * 1000,
  });

  res.json({
    message: "You have logged in successfully",
    type: "success",
    success: true,
  });
};

const logoutUser = async (req: Request, res: Response) => {
  // Clear the cookie
  res.cookie("token", "", {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    maxAge: 0,
  });

  res.status(200).json({
    message: "You have logged out successfully",
    type: "success",
    success: true,
  });
};

const getCurrentUser = async (req: Request, res: Response) => {
  // Ensure user is authenticated
  if (!req.user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  res.status(200).json({
    message: "Current user retrieved successfully",
    type: "success",
    success: true,
    data: req.user,
  });
};

export { registerUser, loginUser, logoutUser, getCurrentUser };
