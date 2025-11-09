import type { GetTokenData } from "../types/get-token-data.ts";

export interface ITokenRepository {
  saveToken(token: string, userId: number, expiresAt: number): Promise<void>;
  getToken(token: string): Promise<GetTokenData | null>;
  deleteToken(token: string): Promise<void>;
}
