import z from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string(),
  username: z.string(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
