import { DeliveryBoy } from "../../../domain/entities/DeliveryBoy";
import { DeliveryBoyRepository } from "../../../infrastructure/database/repositories/DeliveryBoyRepository";
import { IGetDeliveryBoyById } from "./interface/IGetDeliveryBoyById";


export class GetDeliveryBoyById implements IGetDeliveryBoyById {
  constructor(private _deliveryBoyRepo: DeliveryBoyRepository) {}

  async execute(id: string): Promise<DeliveryBoy> {
    const deliveryBoy = await this._deliveryBoyRepo.findById(id);
    
    if (!deliveryBoy) {
      throw new Error('Delivery boy not found');
    }
    
    return deliveryBoy;
  }
}
