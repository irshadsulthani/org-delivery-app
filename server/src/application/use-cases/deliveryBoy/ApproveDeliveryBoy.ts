// src/application/use-cases/deliveryBoy/ApproveDeliveryBoy.ts

import { IDeliveryBoyRepository } from "../../../domain/interface/repositories/IDeliveryBoyRepository";


export class ApproveDeliveryBoy {
  constructor(private deliveryBoyRepository: IDeliveryBoyRepository) {}

  async execute(id: string): Promise<void> {
    await this.deliveryBoyRepository.updateVerificationStatus(id, 'approved');
  }
}