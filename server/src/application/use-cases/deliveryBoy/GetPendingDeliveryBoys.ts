// src/application/use-cases/deliveryBoy/GetPendingDeliveryBoys.ts

import { DeliveryBoy } from "../../../domain/entities/DeliveryBoy";
import { IDeliveryBoyRepository } from "../../../domain/interface/repositories/IDeliveryBoyRepository";

export class GetPendingDeliveryBoys {
  constructor(private deliveryBoyRepository: IDeliveryBoyRepository) {}

  async execute(): Promise<DeliveryBoy[]> {
    return this.deliveryBoyRepository.findPendingDeliveryBoys();
  }
}