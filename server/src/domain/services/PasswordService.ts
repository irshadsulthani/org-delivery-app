import bcrypt from 'bcryptjs'

export class PasswordService {
    static async hash(password: string): Promise<string> {
      return await bcrypt.hash(password, 10);
    }
    static async compare(password: string, hash: string): Promise<boolean> {
      return await bcrypt.compare(password, hash);
    }
  }
  