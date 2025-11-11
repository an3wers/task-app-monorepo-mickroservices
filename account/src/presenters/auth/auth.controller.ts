import type { Request, Response, NextFunction } from "express";
import { AuthService } from "../../application/auth/auth.service.ts";
import { UserService } from "../../application/user/user.service.ts";
import { JwtServive } from "../../application/auth/jwt.service.ts";
import type { IUserRepository } from "../../application/user/interfaces/user-repository.ts";
import type { AuthenticatedRequest } from "../../middleware/auth.middleware.ts";
import type { ITokenRepository } from "../../application/auth/interfaces/token-repository.ts";
import { UnauthorizedError } from "../../errors/app-error.ts";

export class AuthController {
  private authService: AuthService;

  constructor(
    userRepository: IUserRepository,
    tokenRepository: ITokenRepository,
  ) {
    this.authService = new AuthService(
      new UserService(userRepository),
      new JwtServive(tokenRepository),
    );
  }

  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const dto = req.body;
      console.log("authService", this);
      const tokens = await this.authService.register(dto);
      return res.status(201).json(tokens);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {}

  async refreshTokens(req: Request, res: Response, next: NextFunction) {}

  async getMe(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      if (!req.user) {
        throw new UnauthorizedError("Unauthorized");
      }

      const { sub } = req.user;

      if (!sub) {
        throw new UnauthorizedError("Unauthorized");
      }

      const user = await this.authService.getMe(sub as string);

      return res.status(200).json({ user });
    } catch (error) {
      next(error);
    }
  }
}
