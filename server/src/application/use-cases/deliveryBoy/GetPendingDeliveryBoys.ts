// src/application/use-cases/deliveryBoy/GetPendingDeliveryBoys.ts

import { DeliveryBoy } from "../../../domain/entities/DeliveryBoy";
import { IDeliveryBoyRepository } from "../../../infrastructure/database/repositories/interface/IDeliveryBoyRepository";
import { IGetPendingDeliveryBoys } from "./interface/IGetPendingDeliveryBoys";

export class GetPendingDeliveryBoys implements IGetPendingDeliveryBoys {
  constructor(private _deliveryBoyReo: IDeliveryBoyRepository) {}

  async execute(): Promise<DeliveryBoy[]> {
    return this._deliveryBoyReo.findPendingDeliveryBoys();
  }
}