// src/application/use-cases/deliveryBoy/ApproveDeliveryBoy.ts


import { IDeliveryBoyRepository } from "../../../infrastructure/database/repositories/interface/IDeliveryBoyRepository";
import { IApproveDeliveryBoy } from "./interface/IApproveDeliveryBoy";


export class ApproveDeliveryBoy implements IApproveDeliveryBoy {
  constructor(private _deliveryBoyRepo: IDeliveryBoyRepository) {}

  async execute(id: string): Promise<void> {
    await this._deliveryBoyRepo.updateVerificationStatus(id, 'approved');
  }
}
