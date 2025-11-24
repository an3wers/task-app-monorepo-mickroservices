import type { EmailEntity } from "../emais.entity.ts";

export interface SendEmailResult {
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface EmailProvider {
  send(email: EmailEntity): Promise<SendEmailResult>;
}
