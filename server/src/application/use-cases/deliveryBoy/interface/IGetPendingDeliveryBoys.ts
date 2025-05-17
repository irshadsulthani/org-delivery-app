import { DeliveryBoy } from "../../../../domain/entities/DeliveryBoy";


export interface IGetPendingDeliveryBoys{
    execute(): Promise<DeliveryBoy[]>
}