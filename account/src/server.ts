import express, { type Express } from "express";
import cors from "cors";
import { config } from "./config/env.ts";
import { AuthRouter } from "./infrastructure/routes/auth/auth.routes.ts";
import { errorHandler } from "./middleware/error-handler.middleware.ts";
import { createDatabaseConfig, DatabasePool } from "@shared/db-lib";
import { UserSqlRepository } from "./infrastructure/repositories/user/user.sql.repository.ts";

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

  // routes

  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "Task app",
    });
  });

  const userRepository = new UserSqlRepository(db);
  app.use("/api/auth", new AuthRouter(userRepository).router);

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

export { app };

export default app;
