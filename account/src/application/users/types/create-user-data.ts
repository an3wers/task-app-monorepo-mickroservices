export interface CreateUserData {
  email: string;
  username: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
}
