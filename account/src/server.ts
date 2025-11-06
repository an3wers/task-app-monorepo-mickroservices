import express, { type Express } from "express";
import cors from "cors";
import { config } from "./config/env.ts";
import { AuthRouter } from "./infrastructure/routes/auth/auth.routes.ts";
import { errorHandler } from "./middleware/error-handler.middleware.ts";
import { createDatabaseConfig, DatabasePool } from "@shared/db-lib";
// import { UserSqlRepository } from "./infrastructure/repositories/user/user.sql.repository.ts";
import { UserPrismaRepository } from "./infrastructure/repositories/user/user.prisma.repository.ts";
import {
  checkDatabaseConnection,
  disconnectPrisma,
} from "@shared/db-prisma-lib";

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
      service: "Task app",
    });
  });

  // prisma health check
  app.get("/api/check-prisma", async (req, res) => {
    const isConnected = await checkDatabaseConnection();
    if (isConnected) {
      res.status(200).json({
        status: "OK",
        message: "Prisma connection is successful",
      });
    } else {
      res.status(500).json({
        status: "ERROR",
        message: "Prisma connection failed",
      });
    }
  });

  // routes
  const userRepository = new UserPrismaRepository(); // new UserSqlRepository(db);
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
  await disconnectPrisma();
  process.exit(0);
});

export { app };

export default app;
