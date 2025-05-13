// src/application/use-cases/deliveryBoy/RejectDeliveryBoy.ts

import { IDeliveryBoyRepository } from "../../../domain/interface/repositories/IDeliveryBoyRepository";


export class RejectDeliveryBoy {
  constructor(private _deliveryBoyRepo: IDeliveryBoyRepository) {}

  async execute(id: string): Promise<void> {
    await this._deliveryBoyRepo.updateVerificationStatus(id, 'rejected');
  }
}