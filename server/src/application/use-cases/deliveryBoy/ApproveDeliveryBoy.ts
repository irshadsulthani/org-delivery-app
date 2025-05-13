// src/application/use-cases/deliveryBoy/ApproveDeliveryBoy.ts

import { IDeliveryBoyRepository } from "../../../domain/interface/repositories/IDeliveryBoyRepository";


export class ApproveDeliveryBoy {
  constructor(private _deliveryBoyRepo: IDeliveryBoyRepository) {}

  async execute(id: string): Promise<void> {
    await this._deliveryBoyRepo.updateVerificationStatus(id, 'approved');
  }
}