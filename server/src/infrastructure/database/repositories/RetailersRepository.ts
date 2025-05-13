import { IRetailersRepository } from "../../../domain/interface/repositories/IRetailersRepository";
import { RetailerShop } from "../../../domain/entities/RetailerShop";
import { RetailerShopModel } from "../schemas/retailerModel";

export class RetailersRepository implements IRetailersRepository {
  async register(retailer: RetailerShop): Promise<RetailerShop> {
    const newRetailer = new RetailerShopModel(retailer);
    const saved = await newRetailer.save();
    return { ...saved.toObject(), _id: saved._id };
  }

  async findByUserId(userId: string): Promise<RetailerShop | null> {
    const retailer = await RetailerShopModel.findOne({ userId }).populate('userId');
    return retailer ? {...retailer.toObject(), _id: retailer._id} : null;
  }
  async updateVerificationStatus(id: string, isVerified: boolean): Promise<void> {
      await RetailerShopModel.findByIdAndUpdate(
        id,
        {isVerified}
      );
  }
  async findPendingRetailers(): Promise<RetailerShop[]> {
      const pendingRetailers = await RetailerShopModel.find({isVerified:false})
      return pendingRetailers.map(retailer => retailer.toObject())
  }
}
