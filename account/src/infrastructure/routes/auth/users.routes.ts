import { Router } from "express";
import type { IUserRepository } from "../../../application/users/interfaces/users-repository.ts";
import { UsersController } from "../../../presenters/users/users.controller.ts";
// import { checkAuth } from "../../../middleware/auth.middleware.ts";

export class AuthRouter {
  private usersController: UsersController;
  private _router: Router;

  constructor(userRepository: IUserRepository) {
    this.usersController = new UsersController(userRepository);
    this._router = Router();
  }

  get router() {
    this._router.get(
      "/activate/:link",
      this.usersController.activateUser.bind(this.usersController),
    );
    return this._router;
  }
}
