//src/infrastructure/repositories/CustomerRepository.ts
import { Types } from "mongoose";
import { Customer } from "../../../domain/entities/Customer";
import { mapCustomerDocToEntity } from "../mappers/customerMapper";
import { CustomerModel } from "../schemas/customerModel";
import { ICustomerRepository } from "./interface/ICustomerRepository";



export class CustomerRepository implements ICustomerRepository {
    async findByUserId(userId: string): Promise<Customer> {
        const customerDoc = await CustomerModel.findOne({ userId }).exec();
        if (!customerDoc) {
            // Return a new customer object with default values
            return {
                _id: new Types.ObjectId().toString(),
                userId: new Types.ObjectId(userId),
                phone: '',
                addresses: [],
                profileImageUrl: '',
                totalOrders: 0,
                walletBalance: 0,
                createdAt: new Date(),
                updatedAt: new Date()
            };
        }
        return mapCustomerDocToEntity(customerDoc);
    }
}
