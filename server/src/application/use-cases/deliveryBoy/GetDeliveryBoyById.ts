import { DeliveryBoy } from "../../../domain/entities/DeliveryBoy";
import { DeliveryBoyRepository } from "../../../infrastructure/database/repositories/DeliveryBoyRepository";


export class GetDeliveryBoyById {
  constructor(private _deliveryBoyRepo: DeliveryBoyRepository) {}

  async execute(id: string): Promise<DeliveryBoy> {
    const deliveryBoy = await this._deliveryBoyRepo.findById(id);
    
    if (!deliveryBoy) {
      throw new Error('Delivery boy not found');
    }
    
    return deliveryBoy;
  }
}
