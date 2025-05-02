import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { config } from '../../config';
import { MongoUserRepository } from '../database/repositories/MongoUserRepository';
import { GoogleLoginUser } from '../../application/use-cases/auth/GoogleLoginUser';


const userRepo = new MongoUserRepository();
const loginUseCase = new GoogleLoginUser(userRepo);

passport.use(new GoogleStrategy({
  clientID: config.googleClientId || (() => { throw new Error('Google Client ID is not defined'); })(),
  clientSecret: config.googleClientSecret || (() => { throw new Error('Google Client Secret is not defined'); })(),
  callbackURL: config.googleCallbackUrl
}, async (_accessToken, _refreshToken, profile, done) => {
  try {
    const user = await loginUseCase.execute(profile);
    return done(null, user);
  } catch (err) {
    return done(err, false);
  }
}));

passport.serializeUser((user: any, done) => {
    done(null, user.email);
  });
  
  passport.deserializeUser(async (email: string, done) => {
    const user = await userRepo.findByEmail(email);
    done(null, user);
  });
  
