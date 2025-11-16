import { prisma, type User } from "@shared/db-prisma-lib";

import type { IUserRepository } from "../../../application/users/interfaces/users-repository.ts";
import type { CreateUserData } from "../../../application/users/types/create-user-data.ts";
import { UserEntity } from "../../../domain/users/users.domain.ts";
import type { UpdateUserData } from "../../../application/users/types/update-user-data.ts";

export class UserPrismaRepository implements IUserRepository {
  async create(data: CreateUserData): Promise<UserEntity> {
    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: data.password,
        username: data.username,
        isActivated: data.isActivated,
        activationLink: data.activationLink,
      },
    });

    return mapToDomain(user);
  }
  delete(id: string): Promise<void> {
    throw new Error("Method not implemented.");
    // TODO: implement soft delete
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
  async update(id: string, data: UpdateUserData): Promise<UserEntity> {
    const user = await prisma.user.update({
      where: {
        uuid: id,
      },
      data: {
        email: data.email,
        username: data.username,
        fullName: data.fullName,
        passwordHash: data.password,
      },
    });
    return mapToDomain(user);
  }
}

function mapToDomain(prismaData: User): UserEntity {
  return new UserEntity({
    id: prismaData.id,
    uuid: prismaData.uuid,
    email: prismaData.email,
    password: prismaData.passwordHash,
    username: prismaData.username,
    isActivated: prismaData.isActivated,
    fullName: prismaData.fullName ?? "",
    avatarUrl: prismaData.avatarUrl ?? "",
    activationLink: prismaData.activationLink ?? "",
    createdAt: prismaData.createdAt,
    updatedAt: prismaData.updatedAt,
  });
}
