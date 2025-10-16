import app from "../server.js";
import { connectToDatabase } from "../db.js";

// Ensure database connection before handling requests
connectToDatabase().catch(console.error);

export default app;
