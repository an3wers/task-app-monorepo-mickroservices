export class UserEntity {
  id: string;
  uuid: string;
  email: string;
  password: string;
  username: string;
  role: Role;
  isActivated: boolean;
  fullName: string;
  avatarUrl: string;
  createdAt: Date;
  updatedAt: Date;
  activationLink: string;

  constructor(data: UserEntity) {
    this.id = data.id;
    this.uuid = data.uuid;
    this.email = data.email;
    this.username = data.username;
    this.password = data.password;
    this.role = data.role;
    this.isActivated = data.isActivated;
    this.fullName = data.fullName;
    this.avatarUrl = data.avatarUrl;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
    this.activationLink = data.activationLink;
  }
}

export const Role = {
  USER: "USER",
  ADMIN: "ADMIN",
} as const;

export type Role = (typeof Role)[keyof typeof Role];
