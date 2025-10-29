import z from "zod";

export const refreshTokensSchema = z.object({
  refreshToken: z.string(),
});

export type RefreshTokensDto = z.infer<typeof refreshTokensSchema>;
