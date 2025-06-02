// src/infrastructure/repositories/CustomerRepository.ts
import { Types } from "mongoose";
import { ICustomerRepository } from "./interface/ICustomerRepository";
import { Address, Customer } from "../../../domain/entities/Customer";
import { CustomerModel } from "../schemas/customerModel";

export class CustomerRepository implements ICustomerRepository {
  async findByUserId(userId: string): Promise<Customer | null> {
    const customer = await CustomerModel.findOne({ userId: new Types.ObjectId(userId) }).lean();
    return customer ? this.mapToEntity(customer) : null;
  }

 async updateProfile(userId: string, profileData: Partial<Customer>): Promise<Customer> {
  const customer = await CustomerModel.findOneAndUpdate(
    { userId: new Types.ObjectId(userId) },
    { $set: profileData },
    { new: true, upsert: true }
  ).lean();
  return this.mapToEntity(customer);
}


  async addAddress(userId: string, address: Address): Promise<Customer> {
    const customer = await CustomerModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $push: { addresses: address } },
      { new: true, upsert: true }
    ).lean();
    return this.mapToEntity(customer);
  }

  async updateAddress(userId: string, addressId: string, updates: Partial<Address>): Promise<Customer> {
    const setObj: Record<string, any> = {};
    for (const [key, value] of Object.entries(updates)) {
      setObj[`addresses.$.${key}`] = value;
    }

    const customer = await CustomerModel.findOneAndUpdate(
      { 
        userId: new Types.ObjectId(userId),
        "addresses._id": new Types.ObjectId(addressId)
      },
      { $set: setObj },
      { new: true }
    ).lean();

    if (!customer) {
      throw new Error("Address not found");
    }

    return this.mapToEntity(customer);
  }

  async deleteAddress(userId: string, addressId: string): Promise<Customer> {
    const customer = await CustomerModel.findOneAndUpdate(
      { userId: new Types.ObjectId(userId) },
      { $pull: { addresses: { _id: new Types.ObjectId(addressId) } } },
      { new: true }
    ).lean();

    if (!customer) {
      throw new Error("Customer not found");
    }

    return this.mapToEntity(customer);
  }

  async setDefaultAddress(userId: string, addressId: string): Promise<Customer> {
    const session = await CustomerModel.startSession();
    try {
      session.startTransaction();

      // First, set all addresses to non-default
      await CustomerModel.updateOne(
        { userId: new Types.ObjectId(userId) },
        { $set: { "addresses.$[].isDefault": false } },
        { session }
      );

      // Then set the specified address as default
      const customer = await CustomerModel.findOneAndUpdate(
        { 
          userId: new Types.ObjectId(userId),
          "addresses._id": new Types.ObjectId(addressId)
        },
        { $set: { "addresses.$.isDefault": true } },
        { new: true, session }
      ).lean();

      if (!customer) {
        throw new Error("Address not found");
      }

      await session.commitTransaction();
      return this.mapToEntity(customer);
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  private mapToEntity(doc: any): Customer {
    return {
      _id: doc._id,
      userId: doc.userId,
      phone: doc.phone,
      profileImageUrl: doc.profileImageUrl,
      addresses: doc.addresses.map((addr: any) => ({
        _id: addr._id,
        street: addr.street,
        city: addr.city,
        state: addr.state,
        zipCode: addr.zipCode,
        country: addr.country,
        isDefault: addr.isDefault,
        createdAt: addr.createdAt,
        updatedAt: addr.updatedAt
      })),
      totalOrders: doc.totalOrders || 0,
      walletBalance: doc.walletBalance || 0,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt
    };
  }
}