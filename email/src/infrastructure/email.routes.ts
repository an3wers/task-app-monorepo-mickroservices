import { Router } from "express";
import { EmailsController } from "../presenters/emails.controller.ts";
import { EmailsService } from "../application/emails.servise.ts";
import type { EmailsRepository } from "../application/interfaces/emails.repository.ts";
import type { EmailProvider } from "../application/interfaces/email-provider.ts";
import { upload } from "../config/multer.config.ts";

export class EmailRouter {
  private _router: Router;
  private emailsController: EmailsController;

  constructor(
    emailsRepository: EmailsRepository,
    emailProvider: EmailProvider,
  ) {
    this.emailsController = new EmailsController(
      new EmailsService(emailsRepository, emailProvider),
    );
    this._router = Router();
  }

  get router() {
    this._router.post(
      "/",
      upload.array("files", 20),
      this.emailsController.sendEmail.bind(this.emailsController),
    );

    this._router.get(
      "/:id",
      this.emailsController.getEmailStatus.bind(this.emailsController),
    );

    return this._router;
  }
}
