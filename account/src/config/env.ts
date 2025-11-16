import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export const config = {
  origin: process.env.ORIGIN || "http://localhost",
  port: Number(process.env.PORT) || 3010,
  apiUrl:
    process.env.NODE_ENV === "production"
      ? process.env.API_URL_PROD
      : process.env.API_URL_DEV,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
};
