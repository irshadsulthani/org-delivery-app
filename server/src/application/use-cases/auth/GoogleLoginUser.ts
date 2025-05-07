import { User } from "../../../domain/entities/User";
import { UserRepository } from "../../../infrastructure/database/repositories/UserRepository";

// application/use-cases/GoogleLoginUser.ts
export class GoogleLoginUser {
    constructor(private _userRepo: UserRepository) {}
  
    async execute(profile: any): Promise<User> {
      const email = profile.emails?.[0]?.value;
      const name = profile.displayName || 'Google User';
  
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
  