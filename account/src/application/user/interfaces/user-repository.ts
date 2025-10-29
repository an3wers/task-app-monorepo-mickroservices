import type { UserEntity } from "../../../domain/user/user.domain.ts";
import type { CreateUserData } from "../types/create-user-data.ts";
import type { UpdateUserData } from "../types/update-user-data.ts";

export interface IUserRepository {
  create(data: CreateUserData): Promise<UserEntity>;
  findById(id: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  update(id: string, data: UpdateUserData): Promise<UserEntity>;
  delete(id: string): Promise<void>;
}
