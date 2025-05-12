import { DeliveryBoy } from "../../../domain/entities/DeliveryBoy";
import { IDeliveryBoyRepository } from "../../../domain/interface/repositories/IDeliveryBoyRepository";
import { DeliveryBoyModel } from "../schemas/deliveryBoyModel";
import { UserModel } from "../schemas/userModel";


export class DeliveryBoyRepository implements IDeliveryBoyRepository {
    async create(deliveryBoy: DeliveryBoy): Promise<DeliveryBoy> {
      const newDeliveryBoy = new DeliveryBoyModel(deliveryBoy);
      const savedDeliveryBoy = await newDeliveryBoy.save();
      return { ...savedDeliveryBoy.toObject(), _id: savedDeliveryBoy._id.toString() };
    }
  
    async findByUserId(userId: string): Promise<DeliveryBoy | null> {
      return await DeliveryBoyModel.findOne({ userId });
    }
  
    async updateVerificationStatus(userId: string, status: 'pending' | 'approved' | 'rejected', notes?: string): Promise<void> {
      await DeliveryBoyModel.updateOne({ userId }, { verificationStatus: status, verificationNotes: notes });
    }
    async findByEmail(email: string): Promise<DeliveryBoy | null> {
        // First find the user with this email to get their ID
        const user = await UserModel.findOne({ email });
        if (!user) return null;
        
        // Then find the delivery boy profile using the user's ID
        return await DeliveryBoyModel.findOne({ userId: user._id });
    }     
}