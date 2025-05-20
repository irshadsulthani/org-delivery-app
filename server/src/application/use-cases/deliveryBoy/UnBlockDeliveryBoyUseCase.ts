import { IDeliveryBoyRepository } from "../../../infrastructure/database/repositories/interface/IDeliveryBoyRepository";
import { IUserRepository } from "../../../infrastructure/database/repositories/interface/IUserRepository";
import { IUnBlockDeliveryBoyUseCase } from "./interface/IUnBlockDeliveryBoyUseCase";

export class UnBlockDeliveryBoyUseCase implements IUnBlockDeliveryBoyUseCase {
    constructor(
        private readonly _userRepo: IUserRepository,
        private readonly _deliveryBoyRepo: IDeliveryBoyRepository
    ) {}

    async execute(deliveryboyId: string): Promise<void> {
        if (!deliveryboyId || typeof deliveryboyId !== 'string') {
            throw new Error('Invalid retailer ID');
        }
        const deliveryBoy = await this._deliveryBoyRepo.findByUserId(deliveryboyId);
        if (!deliveryBoy) {
            throw new Error('Delivery Boy Not found');
        }
        const userId = typeof deliveryBoy.userId === 'string'
            ? deliveryBoy.userId
            : deliveryBoy.userId._id?.toString();
        await this._userRepo.unblockUser(userId);
    }
}
