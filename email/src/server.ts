import express, { type Express } from "express";
import cors from "cors";
import { config } from "./config/env.ts";
import { errorHandler } from "./presenters/middleware/error-handler.middleware.ts";

import { createDatabaseConfig, DatabasePool } from "@shared/db-lib";

let db: DatabasePool;
const app: Express = express();

try {
  app.use(
    cors({
      origin: config.origin,
      credentials: true,
    }),
  );

  app.use(express.json());

  // db
  db = new DatabasePool(createDatabaseConfig());

  // health check
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "Email service",
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: "Route not found",
      path: req.originalUrl,
    });
  });

  app.use(errorHandler);
} catch (error) {
  console.error(error);
  throw error;
}

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing database connection...");
  await db.close();
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, closing database connection...");
  await db.close();
  process.exit(0);
});

export { app };

export default app;
