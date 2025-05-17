import { IRetailersRepository } from "../../../infrastructure/database/repositories/interface/IRetailersRepository";
import { IApproveDeliveryBoy } from "../deliveryBoy/interface/IApproveDeliveryBoy";


export class ApproveRetailerUseCase implements IApproveDeliveryBoy {
    constructor (private _retailerRepo: IRetailersRepository) {}

    async execute(id: string): Promise <void> {
        await this._retailerRepo.updateVerificationStatus(id, true, 'approved')
    }
}