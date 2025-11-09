export interface CreateUserData {
  email: string;
  name: string;
  password: string;
  isActivated: boolean;
  activationLink: string;
}
