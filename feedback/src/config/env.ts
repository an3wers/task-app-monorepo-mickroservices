import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export const config = {
  port: Number(process.env.PORT) || 3012,

  toEmailFeedback: process.env.TO_EMAIL_FEEDBACK,

  rabbitmq: {
    url: process.env.RABBITMQ_URL!,
    queue: process.env.RABBITMQ_QUEUE!,
    exchange: "email.exchange",
    routingKey: "email.send",
  },
};
