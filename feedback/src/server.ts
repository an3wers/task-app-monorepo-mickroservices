import express, { type Express } from "express";
import cors from "cors";
import { config } from "./config/env.ts";
import { RabbitMQService } from "./infrastructure/rabbitmq.service.ts";

const app: Express = express();

try {
  app.use(
    cors({
      origin: "*",
      credentials: true,
    }),
  );

  app.use(express.json());

  // health check
  app.get("/api/health", (req, res) => {
    res.status(200).json({
      status: "OK",
      timestamp: new Date().toISOString(),
      service: "Feedback",
    });
  });

  // routes
  app.post("/api/feedback", (req, res) => {
    const { title, message } = req.body;

    if (!title || !message) {
      return res.status(400).json({
        error: "Title and message are required",
      });
    }

    rmqService.publish(config.rabbitmq.queue, {
      to: "claim@an3wer.ru",
      subject: "New feedback",
      html: `<h2>${title}</h2><p>${message}</p>`,
    });

    return res.status(200).json({
      message: "Feedback sent successfully",
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      error: "Route not found",
      path: req.originalUrl,
    });
  });

  // RMQ connection
  const rmqService = new RabbitMQService();
  await rmqService.connect();
} catch (error) {
  console.error(error);
  throw error;
}

process.on("SIGTERM", async () => {
  console.log("SIGTERM received, closing database connection...");
  process.exit(0);
});

process.on("SIGINT", async () => {
  console.log("SIGINT received, disconnecting Prisma...");
  process.exit(0);
});

export { app };

export default app;
