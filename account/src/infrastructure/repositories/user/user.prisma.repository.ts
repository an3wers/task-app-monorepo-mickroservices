import { prisma } from "@shared/db-prisma-lib";

import type { IUserRepository } from "../../../application/user/interfaces/user-repository.ts";
import type { CreateUserData } from "../../../application/user/types/create-user-data.ts";
import { UserEntity } from "../../../domain/user/user.domain.ts";

export class UserPrismaRepository implements IUserRepository {
  create(data: CreateUserData): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
  async findByUuid(uuid: string): Promise<UserEntity | null> {
    const userPrisma = await prisma.user.findUnique({
      where: {
        uuid,
      },
    });

    if (!userPrisma) {
      return null;
    }

    return mapToDomain(userPrisma);
  }
  async findByEmail(email: string): Promise<UserEntity | null> {
    const userPrisma = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!userPrisma) {
      return null;
    }

    return mapToDomain(userPrisma);
  }
  update(id: string, data: any): Promise<UserEntity> {
    throw new Error("Method not implemented.");
  }
}

// TODO: fix any
function mapToDomain(prismaData: any): UserEntity {
  return new UserEntity({
    id: prismaData.id,
    uuid: prismaData.uuid,
    email: prismaData.email,
    password: prismaData.password,
    username: prismaData.username,
    isActivated: prismaData.isActivated,
    fullName: prismaData.fullName,
    avatarUrl: prismaData.avatarUrl,
    activationLink: prismaData.activationLink,
    createdAt: prismaData.createdAt,
    updatedAt: prismaData.updatedAt,
  });
}
