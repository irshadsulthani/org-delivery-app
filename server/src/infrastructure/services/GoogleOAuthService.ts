import { MongoUserRepository } from '../database/repositories/MongoUserRepository';
import { User } from '../../domain/entities/User';

export class GoogleLoginUser {
  constructor(private userRepo: MongoUserRepository) {}

  async execute(profile: any): Promise<User> {
    const email = profile.emails[0].value;
    const name = profile.displayName;

    let user = await this.userRepo.findByEmail(email);
    if (!user) {
      user = await this.userRepo.createUser({
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
