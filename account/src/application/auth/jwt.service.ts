import jwt from "jsonwebtoken";
import { config } from "../../config/env.ts";
export class JwtServive {
  generateTokens(payload: {
    sub: string;
    email: string;
    role: string;
    isActive: boolean;
  }) {
    const { jwtAccessSecret, jwtRefreshSecret } = config;

    const accessToken = jwt.sign(payload, jwtAccessSecret, {
      expiresIn: "30m",
    });

    const refreshToken = jwt.sign(payload, jwtRefreshSecret, {
      expiresIn: "30d",
    });

    return { accessToken, refreshToken };
  }

  validateAccessToken(token: string) {
    try {
      const { jwtAccessSecret } = config;
      const validateRes = jwt.verify(token, jwtAccessSecret);
      return validateRes;
    } catch (error) {
      return null;
    }
  }

  validateRefreshToken(token: string) {
    try {
      const { jwtRefreshSecret } = config;
      const validateRes = jwt.verify(token, jwtRefreshSecret);
      return validateRes;
    } catch (error) {
      return null;
    }
  }
}
