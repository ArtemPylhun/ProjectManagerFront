export interface UserInterface {
  id: string;
  userName: string;
  email: string;
  password: string;
  roles: string[];
}

export interface UserLoginInterface {
  emailOrUsername: string;
  password: string;
}

export interface UserRegisterInterface {
  email: string;
  userName: string;
  password: string;
}
