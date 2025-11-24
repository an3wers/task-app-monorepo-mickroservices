import type { AttachmentEntity } from "../domain/attachments.entity.ts";
import type { IEmailRepository } from "./interfaces/emails.repository.ts";
import { config } from "../config/env.ts";
import { EmailStatus } from "../domain/types.ts";
import type { EmailProvider } from "../domain/interfaces/email-provider.ts";
import type { EmailEntity } from "../domain/emais.entity.ts";

export interface SendEmailRequest {
  to: string[];
  subject: string;
  body: string;
  cc?: string[];
  bcc?: string[];
  html?: string;
  attachments?: AttachmentEntity[];
}

export class EmailsService {
  private readonly emailsRepository: IEmailRepository;
  private readonly emailProvider: EmailProvider;

  constructor(
    emailsRepository: IEmailRepository,
    emailProvider: EmailProvider,
  ) {
    this.emailsRepository = emailsRepository;
    this.emailProvider = emailProvider;
  }

  async sendEmail(request: SendEmailRequest): Promise<EmailEntity> {
    // save email to database
    const savedEmail = await this.emailsRepository.save({
      from: config.smtp.from,
      to: request.to,
      subject: request.subject,
      body: request.body,
      cc: request.cc,
      bcc: request.bcc,
      html: request.html,
      attachments: request.attachments,
      status: EmailStatus.PENDING,
    });

    try {
      // send email
      const result = await this.emailProvider.send(savedEmail);

      if (result.success) {
        const sentEmail = this.emailsRepository.update({
          id: savedEmail.id,
          status: EmailStatus.SENT,
          sentAt: new Date(),
        });
        return sentEmail;
      } else {
        const failedEmail = this.emailsRepository.update({
          id: savedEmail.id,
          status: EmailStatus.FAILED,
          error: result.error || "Unknown error",
        });
        return failedEmail;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      const failedEmail = this.emailsRepository.update({
        id: savedEmail.id,
        status: EmailStatus.FAILED,
        error: errorMessage,
      });
      return failedEmail;
    }
  }

  async getEmailStatus(emailId: string): Promise<EmailEntity | null> {
    return this.emailsRepository.findById(emailId);
  }
}
