import { Router } from "express";
import { AuthController } from "../../../presenters/auth/auth.controller.ts";
import type { IUserRepository } from "../../../application/user/interfaces/user-repository.ts";
import { checkAuth } from "../../../middleware/auth.middleware.ts";

export class AuthRouter {
  private authController: AuthController;
  private _router: Router;

  constructor(userRepository: IUserRepository) {
    this.authController = new AuthController(userRepository);
    this._router = Router();
  }

  get router() {
    // TODO: add validation middleware
    this._router.post("/register", this.authController.register);
    this._router.post("/login", this.authController.login);
    this._router.post("/refresh-tokens", this.authController.refreshTokens);
    this._router.get("/me", checkAuth, this.authController.getMe);
    return this._router;
  }
}
