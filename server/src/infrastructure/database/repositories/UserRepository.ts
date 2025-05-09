// src/infrastructure/database/repositories/MongoUserRepository.ts

import { User } from '../../../domain/entities/User';
import { UserModel } from '../schemas/userModel';
import { PasswordService } from '../../../domain/services/PasswordService';
import { IUserRepository } from '../../../domain/interface/repositories/IUserRepository';

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return await UserModel.findOne({ email }) as User;
  }

  async createUser(user: User): Promise<User> {
    const hashed = await PasswordService.hash(user.password || '');
    console.log('user',user);
    
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
  async getAllDeliveryBoys(): Promise<User[]> {
    const deliveryBoys = await UserModel.find({ role: 'deliveryBoy' }).lean();
    return deliveryBoys.map(deliveryBoy => ({
      ...deliveryBoy,
      _id: deliveryBoy._id.toString(),
    }))
  }
  async getAllReatilers():Promise<User[]>{
    const reatilers = await UserModel.find({ role: 'retailer' }).lean();
    return reatilers.map(reatilers => ({
      ...reatilers,
      _id : reatilers._id.toString()
    }))
  }
}
