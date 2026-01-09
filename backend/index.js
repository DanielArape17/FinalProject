/**
 * @module App
 * @description Main entry point for the Educational API.
 * Configures middleware, database connection, and route aggregation.
 */

import express from "express";
import dbConnection from "./config/db.js";
import corsInstance from "./config/whitelist.js";
import userRoutes from "./routes/user.routes.js"
//import testingRoutes from "./routes/testing.routes.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(corsInstance);

dbConnection();

app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res
    .status(200)
    .send("🚀 Educational Server running and connected to MongoDB");
});

app.listen(port, () => {
  console.log(`📡 Server running at http://localhost:${port}`);
  console.log(`👥 User routes available at http://localhost:${port}/api/users`);
});
