export class UserEntity {
  id: bigint; //  number;
  uuid: string;
  email: string;
  password: string;
  username: string;
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
    this.fullName = data.fullName;
    this.password = data.password;
    this.avatarUrl = data.avatarUrl;
    this.activationLink = data.activationLink;
    this.isActivated = data.isActivated;
    this.createdAt = data.createdAt;
    this.updatedAt = data.updatedAt;
  }
}

// export const Role = {
//   USER: "USER",
//   ADMIN: "ADMIN",
// } as const;

// export type Role = (typeof Role)[keyof typeof Role];
