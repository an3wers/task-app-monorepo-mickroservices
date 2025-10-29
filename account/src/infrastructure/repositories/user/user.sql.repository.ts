import { BaseRepository } from "@shared/db-lib";
import type { IUserRepository } from "../../../application/user/interfaces/user-repository.ts";
import type { CreateUserData } from "../../../application/user/types/create-user-data.ts";
import type { UserEntity } from "../../../domain/user/user.domain.ts";

export class UserSqlRepository
  extends BaseRepository
  implements IUserRepository
{
  create(data: CreateUserData): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  findById(id: string): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }
  findByEmail(email: string): Promise<UserEntity | null> {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: any): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }
}
