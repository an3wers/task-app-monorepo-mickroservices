import { BaseRepository, type PoolClient } from "@shared/db-lib";
import type { IEmailRepository } from "../application/interfaces/emails.repository.ts";
import type { SaveEmailData } from "../application/types/save-email-data.ts";
import { EmailEntity } from "../domain/emais.entity.ts";
import type { UpdateEmailData } from "../application/types/update-email-data.ts";
import { AttachmentEntity } from "../domain/attachments.entity.ts";
import { EmailStatus } from "../domain/types.ts";

// DB Tables
// model Email {
//     id          String        @id @default(uuid())
//     from        String
//     to          String[]
//     cc          String[]      @default([])
//     bcc         String[]      @default([])
//     subject     String
//     body        String        @db.Text
//     html        String?       @db.Text
//     status      EmailStatus   @default(PENDING)
//     error       String?       @db.Text
//     sentAt      DateTime?
//     createdAt   DateTime      @default(now())
//     updatedAt   DateTime      @updatedAt
//     attachments Attachment[]

//     @@index([status])
//     @@index([createdAt])
//   }

//   model Attachment {
//     id          String   @id @default(uuid())
//     emailId     String
//     filename    String
//     originalName String
//     mimetype    String
//     size        Int
//     path        String
//     createdAt   DateTime @default(now())

//     email       Email    @relation(fields: [emailId], references: [id], onDelete: Cascade)

//     @@index([emailId])
//   }

export class EmailsSqlRepository
  extends BaseRepository
  implements IEmailRepository
{
  async save(data: SaveEmailData): Promise<EmailEntity> {
    return await this.transaction(async (client: PoolClient) => {
      // Генерируем UUID для письма
      //   const emailIdResult = await client.query<{ id: string }>(
      //     "SELECT gen_random_uuid() as id",
      //   );
      //   const emailId = emailIdResult.rows[0].id;

      // Вставляем письмо
      const emailResult = await client.query<{
        id: string;
        from: string;
        to: string[];
        cc: string[];
        bcc: string[];
        subject: string;
        body: string;
        html: string | null;
        status: string;
        error: string | null;
        sentAt: Date | null;
        createdAt: Date;
        updatedAt: Date;
      }>(
        `INSERT INTO "emails" (
                    "from", "to", cc, bcc, subject, body, html, status, 
                    "createdAt", "updatedAt"
                ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
                RETURNING 
                    id, "from", "to", cc, bcc, subject, body, html, status, 
                    error, "sentAt", "createdAt", "updatedAt"`,
        [
          data.from,
          data.to,
          data.cc || [],
          data.bcc || [],
          data.subject,
          data.body,
          data.html || null,
          data.status,
        ],
      );

      const emailRow = emailResult.rows[0];

      // Сохраняем вложения, если они есть
      const attachments: AttachmentEntity[] = [];
      if (data.attachments && data.attachments.length > 0) {
        for (const attachment of data.attachments) {
          //   const attachmentIdResult = await client.query<{ id: string }>(
          //     "SELECT gen_random_uuid() as id",
          //   );
          //   const attachmentId = attachmentIdResult.rows[0].id;

          await client.query(
            `INSERT INTO "attachments" (
                            "emailId", filename, "originalName", mimetype, size, path, "createdAt"
                        ) VALUES ($1, $2, $3, $4, $5, $6, NOW())`,
            [
              emailRow.id,
              attachment.filename,
              attachment.originalName,
              attachment.mimetype,
              attachment.size,
              attachment.path,
            ],
          );

          attachments.push(
            new AttachmentEntity({
              filename: attachment.filename,
              originalName: attachment.originalName,
              mimetype: attachment.mimetype,
              size: attachment.size,
              path: attachment.path,
            }),
          );
        }
      }

      // Возвращаем EmailEntity
      return new EmailEntity({
        id: emailRow.id,
        from: emailRow.from,
        to: emailRow.to,
        subject: emailRow.subject,
        body: emailRow.body,
        status: emailRow.status as EmailStatus,
        createdAt: emailRow.createdAt,
        cc: emailRow.cc,
        bcc: emailRow.bcc,
        html: emailRow.html || undefined,
        attachments: attachments,
        sentAt: emailRow.sentAt || undefined,
        error: emailRow.error || undefined,
      });
    });
  }
  findById(id: string): Promise<EmailEntity | null> {
    throw new Error("Method not implemented.");
  }
  update(data: UpdateEmailData): Promise<EmailEntity> {
    throw new Error("Method not implemented.");
  }
}
