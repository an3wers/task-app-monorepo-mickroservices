import type { LoginDto } from "../../contracts/auth/login.dto.ts";
import type { RegisterDto } from "../../contracts/auth/register.dto.ts";
import {
  ConflictError,
  NotFoundError,
  ValidationError,
} from "../../errors/app-error.ts";
import type { IUserRepository } from "../user/interfaces/user-repository.ts";
import type { UserService } from "../user/user.service.ts";
import type { JwtServive } from "./jwt.service.ts";

export class AuthService {
  private readonly userService: UserService;
  private readonly jwtService: JwtServive;

  constructor(userService: UserService, jwtService: JwtServive) {
    this.userService = userService;
    this.jwtService = jwtService;
  }

  // TODO: add validation

  async register(dto: RegisterDto) {
    const candidate = await this.userService.findByEmail(dto.email);

    if (candidate) {
      throw new ConflictError("User already exists");
    }

    const user = await this.userService.create(dto);

    // TODO: send email with activation link with email microservice

    const tokens = this.jwtService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });

    return tokens;
  }

  async login(dto: LoginDto) {
    const user = await this.userService.validateUser(dto.email, dto.password);

    const tokens = this.jwtService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });

    return tokens;
  }

  async refreshTokens(dto: { refreshToken: string }) {
    const payload = this.jwtService.validateRefreshToken(dto.refreshToken);

    if (!payload) {
      throw new ValidationError("Invalid refresh token");
    }

    const user = await this.userService.findById(payload.sub as string);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const tokens = this.jwtService.generateTokens({
      sub: user.id,
      email: user.email,
      role: user.role,
      isActive: user.isActive,
    });

    return tokens;
  }

  async getMe() {
    return { userId: "123" };
  }
}
