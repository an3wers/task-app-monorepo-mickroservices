import { genSalt, hash, compare } from "bcrypt";
import type { CreateUserDto } from "../../contracts/user/create.dto.ts";
import type { IUserRepository } from "./interfaces/user-repository.ts";
import { NotFoundError, ValidationError } from "../../errors/app-error.ts";

export class UserService {
  private readonly userRepository: IUserRepository;
  constructor(userRepository: IUserRepository) {
    this.userRepository = userRepository;
  }

  async create(dto: CreateUserDto) {
    const { email, name, password } = dto;
    const hashedPassword = await this.hashPassword(password);

    const user = await this.userRepository.create({
      email,
      name,
      password: hashedPassword,
    });

    return user;
  }

  async findById(id: string) {
    const user = await this.userRepository.findById(id);
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
