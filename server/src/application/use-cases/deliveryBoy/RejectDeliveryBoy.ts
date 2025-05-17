// src/application/use-cases/deliveryBoy/RejectDeliveryBoy.ts


import { IDeliveryBoyRepository } from "../../../infrastructure/database/repositories/interface/IDeliveryBoyRepository";
import { IRejectDeliveryBoy } from "./interface/IRejectDeliveryBoy";


export class RejectDeliveryBoy implements IRejectDeliveryBoy {
  constructor(private _deliveryBoyRepo: IDeliveryBoyRepository) {}

  async execute(id: string): Promise<void> {
    await this._deliveryBoyRepo.updateVerificationStatus(id, 'rejected');
  }
}