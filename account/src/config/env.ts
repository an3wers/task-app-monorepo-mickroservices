import { config as dotenvConfig } from "dotenv";

dotenvConfig();

export const config = {
  origin: process.env.ORIGIN || "http://localhost",
  port: Number(process.env.PORT) || 3010,
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || "",
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || "",
};
