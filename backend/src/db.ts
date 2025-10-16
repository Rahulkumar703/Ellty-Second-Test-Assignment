import mongoose from "mongoose";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

// Global connection state for serverless environments
declare global {
  var mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

// Initialize global cache
if (!global.mongooseCache) {
  global.mongooseCache = {
    conn: null,
    promise: null,
  };
}

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  throw new Error("MONGODB_URI is not defined in environment variables");
}

/**
 * Connect to MongoDB with caching for serverless environments
 * Returns existing connection or creates new one
 */
export const connectToDatabase = async (): Promise<typeof mongoose> => {
  try {
    // If we have an existing connection, return it
    if (global.mongooseCache.conn && mongoose.connection.readyState === 1) {
      console.log("Using existing MongoDB connection");
      return global.mongooseCache.conn;
    }

    // If we have a pending connection promise, wait for it
    if (global.mongooseCache.promise) {
      console.log("Waiting for pending MongoDB connection");
      global.mongooseCache.conn = await global.mongooseCache.promise;
      return global.mongooseCache.conn;
    }

    // Configure mongoose for serverless
    mongoose.set("bufferCommands", false);

    // Create new connection promise
    console.log("Creating new MongoDB connection");
    global.mongooseCache.promise = mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 5,
    });

    // Wait for connection and cache it
    global.mongooseCache.conn = await global.mongooseCache.promise;

    console.log("MongoDB connected successfully");
    return global.mongooseCache.conn;
  } catch (error) {
    // Reset cache on error
    global.mongooseCache.conn = null;
    global.mongooseCache.promise = null;

    console.error("MongoDB connection error:", error);
    throw new Error(`Failed to connect to MongoDB: ${error}`);
  }
};

/**
 * Ensure database is connected before proceeding
 * Use this in API routes that need database access
 */
export const ensureDbConnection = async (): Promise<void> => {
  if (mongoose.connection.readyState !== 1) {
    await connectToDatabase();
  }
};

/**
 * Check if database is currently connected
 */
export const isDbConnected = (): boolean => {
  return mongoose.connection.readyState === 1;
};

export default connectToDatabase;
