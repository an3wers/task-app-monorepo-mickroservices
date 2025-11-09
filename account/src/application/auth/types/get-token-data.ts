export interface GetTokenData {
  id: bigint;
  createdAt: Date;
  userId: bigint;
  token: string;
  expiresAt: Date;
  isRevoked: boolean;
  ipAddress: string | null;
  userAgent: string | null;
  revokedAt: Date | null;
}
