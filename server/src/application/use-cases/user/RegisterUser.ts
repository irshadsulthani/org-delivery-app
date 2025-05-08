import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../domain/interface/repositories/IUserRepository';

export class RegisterUser {
  constructor(private _userRepo: IUserRepository) {}

  async execute(user: User): Promise<User> {
    const existing = await this._userRepo.findByEmail(user.email);
    if (existing) throw new Error("Email already exists");

    const newUser = await this._userRepo.createUser(user);
    return newUser;
  }
}
