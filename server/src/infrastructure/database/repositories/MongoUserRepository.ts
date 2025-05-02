// src/infrastructure/database/repositories/MongoUserRepository.ts

import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { User } from '../../../domain/entities/User';
import { UserModel } from '../schemas/userModel';
import { PasswordService } from '../../../domain/services/PasswordService';

export class MongoUserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email }) as User;
  }

  async createUser(user: User): Promise<User> {
    const hashed = await PasswordService.hash(user.password || '');
    const createdUser = new UserModel({
      ...user,
      password: hashed,
      role: user.role,
    });

    const savedUser = await createdUser.save();

    return {
      ...savedUser.toObject(),
      _id: savedUser._id.toString(),
    };
  }

  async comparePassword(input: string, hash: string): Promise<boolean> {
    return PasswordService.compare(input, hash);
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find({});
    return users.map(user => ({
      ...user.toObject(),
      _id: user._id.toString()
    }))
  }
  async findById(id: string): Promise<any> {
    return await UserModel.findById(id);
  }
  async getAllCustomers(): Promise<User[]> {
    const customers = await UserModel.find({ role: 'customer' }).lean();
    return customers.map(customer => ({
      ...customer,
      _id: customer._id.toString(),
    }));
  }
}
