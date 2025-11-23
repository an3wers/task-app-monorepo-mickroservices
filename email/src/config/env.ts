import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export const config = {
  origin: process.env.ORIGIN || "http://localhost",
  port: Number(process.env.PORT) || 3011,
  nodeEnv: process.env.NODE_ENV || "development",
  apiUrl:
    process.env.NODE_ENV === "production"
      ? process.env.API_URL_PROD
      : process.env.API_URL_DEV,

  smtp: {
    host: process.env.SMTP_HOST!,
    port: parseInt(process.env.SMTP_PORT || "587", 10),
    secure: process.env.SMTP_SECURE === "true",
    auth: {
      user: process.env.SMTP_USER!,
      pass: process.env.SMTP_PASSWORD!,
    },
    from: process.env.SMTP_FROM || "noreply@example.com",
  },

  storage: {
    uploadDir: process.env.UPLOAD_DIR || "./uploads",
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10), // 10MB
  },
};
