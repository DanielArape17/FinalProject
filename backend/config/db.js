import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

/**
 * Establishes a connection to the MongoDB database.
 * * @async
 * @function dbConnection
 * @description Initializes the Mongoose connection using the MONGO_URI environment variable.
 * If the connection fails, the process will log the error and terminate with an exit code of 1.
 * * @returns {Promise<void>} Resolves when the connection is successfully established.
 * @throws {Error} Logs connection errors to the console.
 * * @example
 * // Usage in server.js
 * import dbConnection from './config/db.js';
 * await dbConnection();
 */
const dbConnection = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI || "mongodb://127.0.0.1:27017/curso23"
    );
    console.log("✅ Connected to MongoDB");
  } catch (error) {
    console.error("❌ Connection error:", error);
    process.exit(1);
  }
};

export default dbConnection;
