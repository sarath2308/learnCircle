import { injectable } from "inversify";

export interface IUserCreationService {
  createUser(data: {
    name: string;
    email: string;
    passwordHash?: string;
    googleId?: string;
    role: string;
  }): Promise<void>;
}
@injectable()
export class UserCreationService implements IUserCreationService {
  constructor() {}
  createUser(data: {
    name: string;
    email: string;
    passwordHash?: string;
    googleId?: string;
    role: string;
  }): Promise<void> {}
}
