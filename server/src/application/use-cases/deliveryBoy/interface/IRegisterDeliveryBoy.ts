import { RegisterDeliveryBoyInput } from "../../../../domain/dtos/RegisterDeliveryBoyInput";
import { DeliveryBoy } from "../../../../domain/entities/DeliveryBoy";

export interface IRegisterDeliveryBoy {
  register(input: RegisterDeliveryBoyInput): Promise<DeliveryBoy>;
}
