import { Router } from "express";
import { AuthController } from "../../../presenters/auth/auth.controller.ts";
import type { IUserRepository } from "../../../application/users/interfaces/users-repository.ts";
import { checkAuth } from "../../../presenters/middleware/auth.middleware.ts";
import type { ITokenRepository } from "../../../application/auth/interfaces/token-repository.ts";

export class AuthRouter {
  private authController: AuthController;
  private _router: Router;

  constructor(
    userRepository: IUserRepository,
    tokenRepository: ITokenRepository,
  ) {
    this.authController = new AuthController(userRepository, tokenRepository);
    this._router = Router();
  }

  get router() {
    // TODO: add validation middleware
    this._router.post(
      "/register",
      this.authController.register.bind(this.authController),
    );
    this._router.post(
      "/login",
      this.authController.login.bind(this.authController),
    );
    this._router.post(
      "/refresh-tokens",
      this.authController.refreshTokens.bind(this.authController),
    );
    this._router.get(
      "/me",
      checkAuth,
      this.authController.getMe.bind(this.authController),
    );
    return this._router;
  }
}
