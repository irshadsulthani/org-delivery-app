import { UserRepository } from '../database/repositories/UserRepository';
import { User } from '../../domain/entities/User';

export class GoogleLoginUser {
  constructor(private _userRepo: UserRepository) {}

  async execute(profile: any): Promise<User> {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    let user = await this._userRepo.findByEmail(email);
    if (!user) {
      user = await this._userRepo.createUser({
        name,
        email,
        isGoogleUser: true,
        password: '',
        phone: '',
        role: 'customer',
        isBlocked: false,
        isVerified: true,
        image: profile.photos?.[0]?.value || '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return user;
  }
}
