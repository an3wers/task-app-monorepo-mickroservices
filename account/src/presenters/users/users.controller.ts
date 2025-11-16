import type { NextFunction, Request, Response } from "express";
import type { IUserRepository } from "../../application/users/interfaces/users-repository.ts";
import { UserService } from "../../application/users/users.service.ts";

export class UsersController {
  private usersService: UserService;
  constructor(userRepository: IUserRepository) {
    this.usersService = new UserService(userRepository);
  }

  async activateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const linkHash = req.params.link;
      const redurectPage = req.query.redirect;
      // TODO: redirect to frontend fallback url page
      //   await this.usersService.
      return res.redirect(""); // example: https://frontend.com/${redurectPage}?message=success or error
    } catch (error) {
      next(error);
    }
  }
}
