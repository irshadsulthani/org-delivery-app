// src/domain/interfaces/repositories/IDeliveryBoyRepository.ts

import { DeliveryBoy } from "../../../../domain/entities/DeliveryBoy";


export interface IDeliveryBoyRepository {
    create(deliveryBoy: DeliveryBoy): Promise<DeliveryBoy>;
    findByUserId(userId: string): Promise<DeliveryBoy | null>;
    updateVerificationStatus(userId: string, status: 'pending' | 'approved' | 'rejected', notes?: string): Promise<void>;
    findByEmail(email: string): Promise<DeliveryBoy | null>;
    findPendingDeliveryBoys(): Promise<DeliveryBoy[]>;
    findById(id: string): Promise<DeliveryBoy | null>;
}