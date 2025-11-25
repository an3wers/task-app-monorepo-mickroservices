import type { Request, Response, NextFunction } from "express";
import type { EmailsService } from "../application/emails.servise.ts";
import {
  normalizeSendEmailDto,
  SendEmailDtoSchema,
} from "../contracts/send-email.dto.ts";
import { NotFoundError } from "../presenters/errors/app-error.ts";

export class EmailsController {
  private readonly emailService: EmailsService;

  constructor(emailService: EmailsService) {
    this.emailService = emailService;
  }

  sendEmail = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      // Валидация входных данных
      const validatedData = SendEmailDtoSchema.parse(req.body);
      const normalized = normalizeSendEmailDto(validatedData);

      // Обработка вложений
      const attachments =
        (req.files as Express.Multer.File[])?.map((file) => ({
          filename: file.filename,
          originalName: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
          path: file.path,
        })) || [];

      // Отправка email
      const result = await this.emailService.sendEmail({
        ...normalized,
        attachments,
      });

      res.status(201).json({
        id: result.id,
        status: result.status,
        to: result.to,
        subject: result.subject,
        createdAt: result.createdAt,
        sentAt: result.sentAt,
      });
    } catch (error) {
      next(error);
    }
  };

  getEmailStatus = async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    try {
      const { id } = req.params;
      const email = await this.emailService.getEmailStatus(id);

      if (!email) {
        throw new NotFoundError("Email not found");
      }

      res.json({
        id: email.id,
        status: email.status,
        to: email.to,
        subject: email.subject,
        createdAt: email.createdAt,
        sentAt: email.sentAt,
        error: email.error,
      });
    } catch (error) {
      next(error);
    }
  };
}
