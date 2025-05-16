import { RetailerShop } from "../../../../domain/entities/RetailerShop";


export interface IGetRegistrationStatusUseCase {
    execute(email: string): Promise<{
        verificationStatus?: 'pending' | 'approved' | 'rejected';
        registrationCompleted?: boolean;
        shopDetails?: Partial<RetailerShop>;
    }>;
}