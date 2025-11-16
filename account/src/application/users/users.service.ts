import { genSalt, hash, compare } from "bcrypt";
import { nanoid } from "nanoid";

import type { CreateUserDto } from "../../contracts/users/create.dto.ts";
import type { IUserRepository } from "./interfaces/users-repository.ts";
import { NotFoundError, ValidationError } from "../../errors/app-error.ts";

export class UserService {
  private readonly userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async create(dto: CreateUserDto) {
    const { email, username, password } = dto;
    const hashedPassword = await this.hashPassword(password);
    const activationLink = await this.generateActivationLink(email);

    const user = await this.userRepository.create({
      email,
      username,
      activationLink,
      isActivated: true, // TODO: заменить на false, когда будет имплементирован функционал активации пользователя
      password: hashedPassword,
    });

    return user;
  }

  async findByUuid(uuid: string) {
    const user = await this.userRepository.findByUuid(uuid);
    return user;
  }

  async findByEmail(email: string) {
    const user = await this.userRepository.findByEmail(email);
    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new NotFoundError("User not found");
    }

    const isPasswordValid = await this.comparePassword(password, user.password);

    if (!isPasswordValid) {
      throw new ValidationError("Invalid password");
    }

    return user;
  }

  private async generateActivationLink(email: string): Promise<string> {
    const activationToken = nanoid();
    const activationLink = `/api/users/activate/${activationToken}`;
    return activationLink;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await genSalt(10);
    const result = await hash(password, salt);

    return result;
  }

  private async comparePassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return await compare(password, hash);
  }
}
