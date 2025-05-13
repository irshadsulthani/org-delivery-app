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
    const deliveryBoys = await UserModel.aggregate([
      { $match: { role: 'deliveryBoy' } },
      {
        $lookup: {
          from: 'deliveryboys',
          localField: '_id',
          foreignField: 'userId',
          as: 'deliveryBoyDetails',
        },
      },
      { $unwind: { path: '$deliveryBoyDetails', preserveNullAndEmptyArrays: true } },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: '$deliveryBoyDetails.phone',
          role: 1,
          isBlocked: 1,
          isVerified: 1,
          createdAt: 1,
          status: '$deliveryBoyDetails.status',
          totalDeliveredOrders: '$deliveryBoyDetails.totalDeliveredOrders',
          vehicleType: '$deliveryBoyDetails.vehicleType',
          city: '$deliveryBoyDetails.city',
          state: '$deliveryBoyDetails.state',
          verificationStatus: '$deliveryBoyDetails.verificationStatus',
          currentlyAvailable: '$deliveryBoyDetails.currentlyAvailable',
          userId: '$deliveryBoyDetails._id',
        },
      },
    ]);

    return deliveryBoys.map((boy) => ({
      ...boy,
      _id: boy._id.toString(),
    }));
  }

async getAllRetailers(): Promise<any[]> { 
  return await UserModel.aggregate([
    { $match: { role: 'retailer' } },
    {
      $lookup: {
        from: 'retailershops',
        localField: '_id',
        foreignField: 'userId',
        as: 'shopDetails',
      },
    },
    {
      $unwind: {
        path: '$shopDetails',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        _id: 1,
        name: 1,
        email: 1,
        phone: '$shopDetails.phone',
        role: 1,
        isBlocked: 1,
        isVerified: 1,
        createdAt: 1,
        updatedAt: 1,
        // Shop details
        shopName: '$shopDetails.shopName',
        description: '$shopDetails.description',
        shopImageUrl: '$shopDetails.shopImageUrl',
        shopLicenseUrl: '$shopDetails.shopLicenseUrl',
        address: '$shopDetails.address',
        rating: '$shopDetails.rating',
        reviews: '$shopDetails.reviews',
        shopIsVerified: '$shopDetails.isVerified',
        shopCreatedAt: '$shopDetails.createdAt',
        shopUpdatedAt: '$shopDetails.updatedAt',
        shopId: '$shopDetails._id',
      },
    },
  ]);
}

}
