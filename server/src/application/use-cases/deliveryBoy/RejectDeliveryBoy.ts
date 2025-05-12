// src/application/use-cases/deliveryBoy/RejectDeliveryBoy.ts

import { IDeliveryBoyRepository } from "../../../domain/interface/repositories/IDeliveryBoyRepository";


export class RejectDeliveryBoy {
  constructor(private deliveryBoyRepository: IDeliveryBoyRepository) {}

  async execute(id: string): Promise<void> {
    await this.deliveryBoyRepository.updateVerificationStatus(id, 'rejected');
  }
}