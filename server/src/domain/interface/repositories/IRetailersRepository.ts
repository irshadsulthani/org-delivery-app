import { RetailerShop } from "../../entities/RetailerShop";

export interface IRetailersRepository {
  register(retailer: RetailerShop): Promise<RetailerShop>;
  findByUserId(userId: string): Promise<RetailerShop | null>;
  updateVerificationStatus(id: string, isVerified: boolean,status: 'pending' | 'approved' | 'rejected'): Promise<void>;
  findPendingRetailers(): Promise<RetailerShop[]>;
}
