import type { UserEntity } from "../../../domain/user/user.domain.ts";
import type { CreateUserData } from "../types/create-user-data.ts";
import type { UpdateUserData } from "../types/update-user-data.ts";

export interface IUserRepository {
  create(data: CreateUserData): Promise<UserEntity>;
  findByUuid(uuid: string): Promise<UserEntity | null>;
  findByEmail(email: string): Promise<UserEntity | null>;
  update(uuid: string, data: UpdateUserData): Promise<UserEntity>;
  delete(uuid: string): Promise<void>;
}
