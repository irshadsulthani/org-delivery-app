// src/infrastructure/database/mappers/customerMapper.ts
import { CustomerDoc } from "../schemas/customerModel";
import { Customer } from "../../../domain/entities/Customer";

export function mapCustomerDocToEntity(doc: CustomerDoc): Customer {
    return {
        _id: doc._id.toString(),
        userId: doc.userId,
        phone: doc.phone,
        addresses: doc.addresses.map(addr => ({
            street: addr.street,
            city: addr.city,
            state: addr.state,
            zipCode: addr.zipCode,
            country: addr.country,
            isDefault: addr.isDefault
        })),
        profileImageUrl: doc.profileImageUrl,
        totalOrders: doc.totalOrders,
        walletBalance: doc.walletBalance,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt
    };
}