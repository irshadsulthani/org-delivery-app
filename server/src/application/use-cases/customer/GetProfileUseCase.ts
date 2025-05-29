import { Types } from "mongoose";
import { ProfileResponseDTO } from "../../../domain/dtos/customer/ProfileDTOs";
import { ICustomerRepository } from "../../../infrastructure/database/repositories/interface/ICustomerRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";


export class GetProfileUseCase {
    constructor(
        private readonly _customerRepo: ICustomerRepository,
        private readonly _userRepo: IUserRepository
    ){}
    async execute(userId: string): Promise<ProfileResponseDTO>{
        const user = await this._userRepo.findById(userId);
        if (!user) {
            throw new Error("User not found");
        }
        const customer = await this._customerRepo.findByUserId(userId) || {
            userId: new Types.ObjectId(userId),
            addresses: [],
            phone:'',
            profileImageUrl: '',
        }
        return {
            name: user.name,
            email: user.email,
            phone: customer.phone || '',
            profileImageUrl: customer.profileImageUrl || '',
            addresses: customer.addresses.map(address => ({
                _id: address._id,
                street: address.street,
                city: address.city,
                state: address.state,
                zipCode: address.zipCode,
                country: address.country,
                isDefault: address.isDefault,
                createdAt: address.createdAt,
                updatedAt: address.updatedAt
            }))
        }
    }
}