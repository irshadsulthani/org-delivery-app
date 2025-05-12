import { DeliveryBoy } from "../../entities/DeliveryBoy";


export interface IDeliveryBoyRepository {
    create(deliveryBoy: DeliveryBoy ):Promise<DeliveryBoy>;
    findByUserId(userId : string) : Promise <DeliveryBoy | null>;
    updateVerificationStatus(userId: string, status: 'pending' | 'approved' | 'rejected'): Promise<void>;
    findByEmail(email: string): Promise<DeliveryBoy | null>;
}