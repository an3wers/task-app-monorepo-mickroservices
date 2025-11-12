import z from "zod";

export const registerSchema = z.object({
  email: z.email(),
  password: z.string(),
  name: z.string(), // TOOD: username
});

export type RegisterDto = z.infer<typeof registerSchema>;
