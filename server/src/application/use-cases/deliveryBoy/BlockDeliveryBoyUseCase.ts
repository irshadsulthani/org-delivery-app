import { IDeliveryBoyRepository } from "../../../infrastructure/database/repositories/interface/IDeliveryBoyRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IBlockDeliveryBoyUseCase } from "./interface/IBlockDeliveryBoyUseCase";


export class BlockDeliveryBoyUseCase implements IBlockDeliveryBoyUseCase {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _deliveryBoyRepo: IDeliveryBoyRepository
    ){}
    async execute(deliveryBoyId: string): Promise<void> {
        const deliveryBoy = await this._deliveryBoyRepo.findByUserId(deliveryBoyId)
        if(!deliveryBoy) throw new Error('Delivery boy Not Found')
        const userId = typeof deliveryBoy.userId === 'string'
            ? deliveryBoy.userId
            : deliveryBoy.userId._id.toString();
        await this._userRepo.blockUser(userId)
    }
}