export class UserEntity {
  id: string;
  email: string;
  password: string;
  name: string;
  role: Role;
  isActive: boolean;

  constructor(data: UserEntity) {
    this.id = data.id;
    this.email = data.email;
    this.name = data.name;
    this.password = data.password;
    this.role = data.role;
    this.isActive = data.isActive;
  }
}

export const enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}
