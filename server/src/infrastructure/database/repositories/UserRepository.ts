// src/infrastructure/database/repositories/MongoUserRepository.ts

import { User } from "../../../domain/entities/User";
import { UserModel } from "../schemas/userModel";
import { PasswordService } from "../../../domain/services/PasswordService";
import { IUserRepository } from "./interface/IUserRepository";
import { DeliveryBoyListingRequest } from "../../../domain/dtos/DeliveryBoyListingRequest";
import { DeliveryBoyResponse } from "../../../domain/dtos/DeliveryBoyResponse";

export class UserRepository implements IUserRepository {
  async findByEmail(email: string): Promise<User | null> {
    return (await UserModel.findOne({ email })) as User;
  }

  async createUser(user: User): Promise<User> {
    const hashed = await PasswordService.hash(user.password || "");
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
    return users.map((user) => ({
      ...user.toObject(),
      _id: user._id.toString(),
    }));
  }
  async findById(id: string): Promise<any> {
    return await UserModel.findById(id);
  }
  async getAllCustomers(): Promise<User[]> {
    const customers = await UserModel.find({ role: "customer" }).lean();
    return customers.map((customer) => ({
      ...customer,
      _id: customer._id.toString(),
    }));
  }
  async getAllDeliveryBoysPaginated(
    params: DeliveryBoyListingRequest
  ): Promise<{
    data: DeliveryBoyResponse[];
    total: number;
  }> {
    const { page = 1, limit = 5, search = "", filters = {}, sort } = params;
    const skip = (page - 1) * limit;

    // Build the match query
    const matchQuery: any = { role: "deliveryBoy" };

    if (search) {
      matchQuery.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { "deliveryBoyDetails.phone": { $regex: search, $options: "i" } },
      ];
    }

    // Apply filters
    if (filters.verificationStatus) {
      matchQuery["deliveryBoyDetails.verificationStatus"] =
        filters.verificationStatus;
    }
    if (filters.isBlocked !== undefined) {
      matchQuery.isBlocked = filters.isBlocked;
    }
    if (filters.vehicleType) {
      matchQuery["deliveryBoyDetails.vehicleType"] = filters.vehicleType;
    }
    if (filters.currentlyAvailable !== undefined) {
      matchQuery["deliveryBoyDetails.currentlyAvailable"] =
        filters.currentlyAvailable;
    }

    // Build sort
    let sortQuery: any = { createdAt: -1 };
    if (sort) {
      const sortFieldMap: Record<string, string> = {
        "userId.name": "name",
        verificationStatus: "deliveryBoyDetails.verificationStatus",
        vehicleType: "deliveryBoyDetails.vehicleType",
        totalDeliveredOrders: "deliveryBoyDetails.totalDeliveredOrders",
        createdAt: "createdAt",
      };
      const dbField = sortFieldMap[sort.field] || sort.field;
      sortQuery = { [dbField]: sort.direction === "asc" ? 1 : -1 };
    }

    // Main aggregation pipeline
    const pipeline = [
      { $match: { role: "deliveryBoy" } },
      {
        $lookup: {
          from: "deliveryboys",
          localField: "_id",
          foreignField: "userId",
          as: "deliveryBoyDetails",
        },
      },
      { $unwind: "$deliveryBoyDetails" },
      { $match: matchQuery }, // Apply filters after lookup
      {
        $facet: {
          metadata: [{ $count: "total" }],
          data: [
            { $sort: sortQuery },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                _id: "$deliveryBoyDetails._id",
                userId: {
                  _id: "$_id",
                  name: "$name",
                  email: "$email",
                  isBlocked: "$isBlocked",
                },
                phone: "$deliveryBoyDetails.phone",
                profileImageUrl: "$deliveryBoyDetails.profileImageUrl",
                verificationStatus: "$deliveryBoyDetails.verificationStatus",
                currentlyAvailable: "$deliveryBoyDetails.currentlyAvailable",
                vehicleType: "$deliveryBoyDetails.vehicleType",
                totalDeliveredOrders:
                  "$deliveryBoyDetails.totalDeliveredOrders",
                createdAt: "$createdAt",
              },
            },
          ],
        },
      },
      {
        $project: {
          data: "$data",
          total: { $arrayElemAt: ["$metadata.total", 0] },
        },
      },
    ];

    const result = await UserModel.aggregate(pipeline);
    const data = result[0]?.data || [];
    const total = result[0]?.total || 0;

    return {
      data: data.map((item: { _id: { toString: () => any; }; userId: { _id: { toString: () => any; }; }; }) => ({
        ...item,
        _id: item._id.toString(),
        userId: {
          ...item.userId,
          _id: item.userId._id.toString(),
        },
      })),
      total,
    };
  }

  async getAllRetailers(): Promise<any[]> {
    return await UserModel.aggregate([
      { $match: { role: "retailer" } },
      {
        $lookup: {
          from: "retailershops",
          localField: "_id",
          foreignField: "userId",
          as: "shopDetails",
        },
      },
      {
        $unwind: {
          path: "$shopDetails",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          email: 1,
          phone: "$shopDetails.phone",
          role: 1,
          isBlocked: 1,
          isVerified: 1,
          createdAt: 1,
          updatedAt: 1,
          // Shop details
          shopName: "$shopDetails.shopName",
          description: "$shopDetails.description",
          shopImageUrl: "$shopDetails.shopImageUrl",
          shopLicenseUrl: "$shopDetails.shopLicenseUrl",
          address: "$shopDetails.address",
          rating: "$shopDetails.rating",
          reviews: "$shopDetails.reviews",
          shopIsVerified: "$shopDetails.isVerified",
          shopCreatedAt: "$shopDetails.createdAt",
          shopUpdatedAt: "$shopDetails.updatedAt",
          shopId: "$shopDetails._id",
        },
      },
    ]);
  }
  async blockUser(userId: string): Promise<User> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isBlocked: true },
      { new: true }
    );
    if (!user) throw new Error("User not found");
    const userObj = user.toObject();
    return {
      ...userObj,
      _id: userObj._id.toString(),
    };
  }

  async unblockUser(userId: string): Promise<User> {
    const user = await UserModel.findByIdAndUpdate(
      userId,
      { isBlocked: false },
      { new: true }
    );
    if (!user) throw new Error("User not found");
    const userObj = user.toObject();
    return {
      ...userObj,
      _id: userObj._id.toString(),
    };
  }
}
