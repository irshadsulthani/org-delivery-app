import { DeliveryBoy } from "../../../../domain/entities/DeliveryBoy";

export interface IGetDeliveryBoyById {
    execute(id: string): Promise<DeliveryBoy>;
}