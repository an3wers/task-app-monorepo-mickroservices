// TODO: zod schema

export interface CreateUserDto {
  email: string;
  username: string;
  password: string;
}

export interface UpdateUserDto {
  email?: string;
  username?: string;
  password?: string;
  fullName?: string;
}
