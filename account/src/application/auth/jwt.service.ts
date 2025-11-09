import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../../config/env.ts";
import type { ITokenRepository } from "./interfaces/token-repository.ts";
export class JwtServive {
  tokenRepository: ITokenRepository;

  constructor(tokenRepository: ITokenRepository) {
    this.tokenRepository = tokenRepository;
  }

  generateTokens(payload: {
    sub: string;
    email: string;
    isActivated: boolean;
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

  async saveRefreshToken(token: string, userId: number) {
    const payload = jwt.decode(token); // this.validateRefreshToken(token);
    if (!payload) throw new Error("Invalid token");

    if (typeof payload === "string") {
      await this.tokenRepository.saveToken(token, userId, 0);
    } else {
      await this.tokenRepository.saveToken(token, userId, payload.exp || 0);
    }
  }

  async getRefreshToken(token: string) {
    const currentToken = await this.tokenRepository.getToken(token);
    if (!currentToken) return null;

    if (currentToken.isRevoked) {
      return null;
    }

    // TODO: check if the token is expired

    return currentToken;
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
