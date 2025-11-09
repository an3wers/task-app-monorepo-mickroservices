import { prisma } from "@shared/db-prisma-lib";
import type { ITokenRepository } from "../../../application/auth/interfaces/token-repository.ts";
import type { GetTokenData } from "../../../application/auth/types/get-token-data.ts";

export class TokenPrismaRepository implements ITokenRepository {
  async saveToken(token: string, userId: number, expiresAt: number) {
    await prisma.refreshToken.create({
      data: {
        token,
        userId: userId,
        expiresAt: String(expiresAt),
      },
    });
  }

  async getToken(token: string): Promise<GetTokenData | null> {
    const refreshToken = await prisma.refreshToken.findUnique({
      where: {
        token,
      },
    });
    return refreshToken;
  }

  deleteToken(token: string): Promise<void> {
    throw new Error("No implements");
  }
}
