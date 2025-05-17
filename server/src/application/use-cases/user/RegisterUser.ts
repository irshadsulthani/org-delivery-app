import { User } from '../../../domain/entities/User';
import { IUserRepository } from '../../../infrastructure/database/repositories/interface/IUserRepository';
import { IRegisterUser } from './interface/IRegisterUser';


export class RegisterUser implements IRegisterUser {
  constructor(private _userRepo: IUserRepository) {}

  async execute(user: User): Promise<User> {
    const existing = await this._userRepo.findByEmail(user.email);
    if (existing) throw new Error("Email already exists");

    const newUser = await this._userRepo.createUser(user);
    return newUser;
  }
}
