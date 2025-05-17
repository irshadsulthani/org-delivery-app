// src/application/use-cases/deliveryBoy/UpdateDeliveryBoyVerificationStatus.ts


import { IDeliveryBoyRepository } from "../../../infrastructure/database/repositories/interface/IDeliveryBoyRepository";
import { IUpdateDeliveryBoyVerificationStatus } from "./interface/IUpdateDeliveryBoyVerificationStatus";


export class UpdateDeliveryBoyVerificationStatus implements IUpdateDeliveryBoyVerificationStatus {
  constructor(private deliveryBoyRepository: IDeliveryBoyRepository) {}

  async execute(
    deliveryBoyId: string,
    status: 'pending' | 'approved' | 'rejected'
  ): Promise<void> {
    await this.deliveryBoyRepository.updateVerificationStatus(deliveryBoyId, status);
  }
}