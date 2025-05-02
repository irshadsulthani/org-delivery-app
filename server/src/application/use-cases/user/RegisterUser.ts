import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';

export class RegisterUser {
  constructor(private userRepo: IUserRepository) {}

  async execute(user: User): Promise<User> {
    const existing = await this.userRepo.findByEmail(user.email);
    if (existing) throw new Error("Email already exists");

    const newUser = await this.userRepo.createUser(user);
    return newUser;
  }
}
