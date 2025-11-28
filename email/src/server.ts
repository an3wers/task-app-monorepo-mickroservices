import express, { type Express } from "express";
import cors from "cors";
import { config } from "./config/env.ts";
import { errorHandler } from "./presenters/middleware/error-handler.middleware.ts";

import { createDatabaseConfig, DatabasePool } from "@shared/db-lib";
import { EmailRouter } from "./infrastructure/email.routes.ts";
import { EmailsSqlRepository } from "./infrastructure/emails.sql.repository.ts";
import { NodemailerProvider } from "./infrastructure/nodemailer-provider.ts";

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
  app.use(express.urlencoded({ extended: true }));

  // db
  db = new DatabasePool(createDatabaseConfig("emailservice"));

  // health check
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "Email service",
    });
  });

  // routes
  // dependencies
  const emailsRepository = new EmailsSqlRepository(db);
  const emailProvider = new NodemailerProvider();

  app.use(
    "/api/emails",
    new EmailRouter(emailsRepository, emailProvider).router,
  );

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
