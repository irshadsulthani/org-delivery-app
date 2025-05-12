// src/application/use-cases/deliveryBoy/UpdateDeliveryBoyVerificationStatus.ts

import { IDeliveryBoyRepository } from "../../../domain/interface/repositories/IDeliveryBoyRepository";


export class UpdateDeliveryBoyVerificationStatus {
  constructor(private deliveryBoyRepository: IDeliveryBoyRepository) {}

  async execute(
    deliveryBoyId: string,
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<void> {
    await this.deliveryBoyRepository.updateVerificationStatus(deliveryBoyId, status);
  }
}