import { z } from "zod";

export const SendEmailDtoSchema = z.object({
  to: z.union([z.email(), z.array(z.email())]),
  subject: z.string().min(1),
  body: z.string().min(1),
  html: z.string().optional(),
  cc: z.union([z.email(), z.array(z.email())]).optional(),
  bcc: z.union([z.email(), z.array(z.email())]).optional(),
});

export type SendEmailDto = z.infer<typeof SendEmailDtoSchema>;

export function normalizeSendEmailDto(dto: SendEmailDto): {
  to: string[];
  cc: string[];
  bcc: string[];
  subject: string;
  body: string;
  html?: string;
} {
  return {
    to: Array.isArray(dto.to) ? dto.to : [dto.to],
    cc: dto.cc ? (Array.isArray(dto.cc) ? dto.cc : [dto.cc]) : [],
    bcc: dto.bcc ? (Array.isArray(dto.bcc) ? dto.bcc : [dto.bcc]) : [],
    subject: dto.subject,
    body: dto.body,
    html: dto.html,
  };
}
