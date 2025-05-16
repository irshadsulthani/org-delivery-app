import { RetailerShop } from "../../../domain/entities/RetailerShop";
import { IRetailersRepository } from "../../../domain/interface/repositories/IRetailersRepository";
import { IUserRepository } from "../../../domain/interface/repositories/IUserRepository";
import { IGetRegistrationStatusUseCase } from "./interface/IGetRegistrationStatuseUseCase";


export class GetRegistrationStatusUseCase implements IGetRegistrationStatusUseCase {
    constructor(
        private _retailRepo: IRetailersRepository,
        private _userRepo: IUserRepository
    ){}

    async execute(email: string): Promise<{
        verificationStatus?: 'pending' | 'approved' | 'rejected';
        registrationCompleted?: boolean;
        shopDetails?: Partial<RetailerShop>;
    }> {
        const user = await this._userRepo.findByEmail(email);
        if(!user) throw new Error('User not found');

        const retailShop = await this._retailRepo.findByUserId(user._id as string);

        if(!retailShop) {
            return {
                registrationCompleted: false,
                verificationStatus: undefined
            };
        }
        
        return {
            verificationStatus: retailShop.verificationStatus,
            registrationCompleted: retailShop.registrationCompleted,
            shopDetails: {
                shopName: retailShop.shopName,
                phone: retailShop.phone,
                description: retailShop.description
            }
        };
    }
}